import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IAuthProvider } from './types.d.ts';
import { AuthenticationTokenController } from '../authentication-tokens/controller.ts';
import { Config } from '../../../config.ts';
import { MediaController } from '../../media/controller.ts';
import { UserController } from '../../users/controller.ts';


const providers: IAuthProvider[] = [];

export function registerProvider(provider: IAuthProvider) {
  providers.push(provider);
}


async function makeFreshToken() {

  let token = '';
  let iteration = 0;

  while (true) {

    iteration++;
    if (iteration > 2000) {
      throw new Error('could not make a fresh unused token');
    }

    const intArray = new Uint32Array(32);
    crypto.getRandomValues(intArray);
    token = [...intArray].map(it => it.toString(16)).join('');

    if (await AuthenticationTokenController.count({ filters: { token, valid: true } }) === 0) {
      break;
    }

  }

  return token;

}


const AuthenticationRouterMaker = new ResourceMaker('AuthRouter');

AuthenticationRouterMaker.addActions({
  'login': {
    method: 'post',
    path: '/login',
    signal: 'Route.Authentication.Login',
    // rateLimit: {
    //   points: 3,
    //   windowDuration: 60,
    //   blockDuration: 60
    // },
    captcha: {
      enabled: true
    },
    provider: (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      return providerAgent.login(context);

    }
  },
  'register': {
    method: 'post',
    path: '/register',
    signal: 'Route.Authentication.Register',
    // rateLimit: {
    //   points: 3,
    //   windowDuration: 60,
    //   blockDuration: 60
    // },
    captcha: {
      enabled: true
    },
    provider: (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      return providerAgent.register(context);

    }
  },
  'verify': {
    method: 'post',
    path: '/verify',
    signal: 'Route.Authentication.Verify',
    // rateLimit: {
    //   points: 3,
    //   windowDuration: 60,
    //   blockDuration: 60
    // },
    provider: async (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      const user = await providerAgent.verify(context);
      const token = await makeFreshToken();

      const authenticationToken = await AuthenticationTokenController.create({
        document: {
          user,
          token,
          valid: true,
          validUntil: Config.authentication.tokenLifetime ? Date.now() + Config.authentication.tokenLifetime : undefined
        }
      });

      return authenticationToken.token;

    }
  },
  'identity': {
    method: 'get',
    path: '/identity',
    signal: 'Route.Authentication.Identity',
    requiresAuthentication: true,
    provider: async ({ user, userPermissions, userRoles }) => {

      if (user!.profile) {
        (user!.profile as unknown) = await MediaController.find({ resourceId: user!.profile });
      }

      return {
        ...user,
        permissions: userPermissions,
        roles: userRoles
      };

    }
  },
  'change-identity': {
    method: 'patch',
    path: '/identity',
    signal: 'Route.Authentication.ChangeIdentity',
    requiresAuthentication: true,
    provider: ({ user, payload }) => {
      return UserController.update({
        resourceId: user!._id,
        payload
      });
    }
  },
  'logout': {
    method: 'post',
    path: '/logout',
    signal: 'Route.Authentication.Logout',
    requiresAuthentication: true,
    provider: async ({ token }) => {

      await AuthenticationTokenController.updateBy({
        filters: {
          token,
          valid: true
        },
        payload: {
          valid: false,
          invalidatedAt: Date.now()
        }
      });

      return true;

    }
  },
});

export const AuthenticationRouter = AuthenticationRouterMaker.getRouter();
