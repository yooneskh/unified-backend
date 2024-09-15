import { Config } from 'config';
import { IUnifiedApp, NotFoundError } from 'unified-app';
import { install as installUsers } from './users/mod.ts';
import { install as installAuthenticationTokens } from './authentication-tokens/mod.ts';
import { install as installRegistrationTokens } from './registration-tokens/mod.ts';
import { install as installVerificationTokens } from './verification-tokens/mod.ts';
import { IUser } from './users/mod.ts';
import { createToken } from './utils/create-token.ts';
import { createVerificationCode } from './utils/create-verification-code.ts';
import { sendResendMail } from '../../lib/resend-agent/mod.ts';


declare module 'unified-app' {

  interface IUnifiedActionContext {
    user?: IUser;
  }

  interface IUnifiedAction {
    requiresAuthentication?: boolean,
  }

}


export function install(app: IUnifiedApp) {

  installUsers(app);
  installAuthenticationTokens(app);
  installRegistrationTokens(app);
  installVerificationTokens(app);


  app.addMiddlewares({
    'check-authentication': async context => {

      if (context.headers['authorization']) {
  
        const authToken = await context.app.authenticationTokens.find({
          filter: {
            token: context.headers['authorization'],
            validUntil: { $gte: Date.now() },
          },
        });
  
        if (authToken) {
          context.user = await context.app.users.find({
            resourceId: authToken.user,
          });
        }
  
      }
  
      if (context.action.requiresAuthentication) {
        if (!context.user) {
          throw new Error('you are not authenticated');
        }
      }
  
    },
  });


  app.addActions({
    'login': {
      method: 'post',
      path: '/authentication/login',
      requiresCaptcha: true,
      rateLimit: {
        points: 5,
        windowDuration: 60_000 * 60,
        blockDuration: 60_000 * 60,
      },
      handler: async ({ body }) => {
        
        if (!body.method) {
          throw new Error('no method specified');
        }
  
        if (!['email'].includes(body.method)) {
          throw new Error('invalid method');
        }
  
  
        if (body.method === 'email') {
  
          const user = await app.users.find({
            filter: {
              email: body.email,
            },
          });
  
          if (!user) {
            throw new NotFoundError();
          }
  
  
          const verificationToken = await app.verificationTokens.create({
            document: {
              user: user._id,
              code: Config.authentication.verificationTokenStaticCode || createVerificationCode(Config.authentication.verificationTokenLength),
              validUntil: Date.now() + Config.authentication.verificationTokenLifetime,
            },
          });
  
  
          if (!Config.authentication.verificationTokenStaticCode) {
            await sendResendMail({
              authorization: Config.resend.authorization,
              from: Config.resend.from,
              to: [user.email],
              subject: 'Login Code',
              text: `Welcome, your login code is: ${verificationToken.code}`,
            });
          }
  
  
          return {
            needsVerification: true,
            verificationToken: verificationToken._id,
          };
  
        }
  
      },
    },
    'register': {
      method: 'post',
      path: '/authentication/register',
      requiresCaptcha: true,
      rateLimit: {
        points: 5,
        windowDuration: 60_000 * 60,
        blockDuration: 60_000 * 60,
      },
      handler: async ({ body }) => {
        
        const { email } = body;
  
        if (!email) {
          throw new Error('email must be entered');
        }
  
  
        const oldUserExists = await app.users.exists({
          filter: {
            email,
          },
        });
  
        if (oldUserExists) {
          throw new Error('user with this email exists');
        }
  
  
        const registrationToken = await app.registrationTokens.create({
          document: {
            userEmail: email,
            validUntil: Date.now() + Config.authentication.registrationTokenLifetime,
            resolved: false,
          },
        });
  
        const verificationToken = await app.verificationTokens.create({
          document: {
            registrationToken: registrationToken._id,
            code: Config.authentication.verificationTokenStaticCode || createVerificationCode(Config.authentication.verificationTokenLength),
            validUntil: Date.now() + Config.authentication.verificationTokenLifetime,
          },
        });
  
  
        if (!Config.authentication.verificationTokenStaticCode) {
          await sendResendMail({
            authorization: Config.resend.authorization,
            from: Config.resend.from,
            to: [email],
            subject: 'Registration Code',
            text: `Welcome, your registration code is: ${verificationToken.code}`,
          });
        }
  
  
        return {
          needsVerification: true,
          verificationToken: verificationToken._id,
        };
  
      },
    },
    'verify': {
      method: 'post',
      path: '/authentication/verify',
      rateLimit: {
        points: 5,
        windowDuration: 60_000 * 60,
        blockDuration: 60_000 * 60,
      },
      handler: async ({ body }) => {
        
        if (!body.verificationToken || !body.verificationCode) {
          throw new Error('invalid credentials');
        }
  
  
        let userId = '';
  
        const verificationToken = await app.verificationTokens.find({
          resourceId: body.verificationToken,
          filter: {
            code: body.verificationCode,
            validUntil: { $gte: Date.now() },
          },
        });
  
        if (!verificationToken) {
          throw new Error('invalid credentials');
        }
  
  
        if (verificationToken.user) {
          userId = verificationToken.user;
        }
        else if (verificationToken.registrationToken) {
  
          const registrationToken = await app.registrationTokens.find({
            resourceId: verificationToken.registrationToken,
            filter: {
              validUntil: { $gte: Date.now() },
              resolved: false,
            },
          });
  
          if (!registrationToken) {
            throw new Error('invalid credentials');
          }
  
          await app.registrationTokens.update({
            resourceId: registrationToken._id,
            payload: {
              resolved: true,
            },
          });
  
  
          const oldUserExists = await app.users.exists({
            filter: {
              email: registrationToken.userEmail,
            },
          });
  
          if (oldUserExists) {
            throw new Error('user with this email exists');
          }
  
  
          const newUser = await app.users.create({
            document: {
              email: registrationToken.userEmail,
            },
          });
  
  
          userId = newUser._id;
  
        }
  
  
        if (!userId) {
          throw new Error('invalid credentials');
        }
  
  
        const authenticationToken = await app.authenticationTokens.create({
          document: {
            user: userId,
            token: createToken(Config.authentication.authenticationTokenUnits),
            validUntil: Date.now() + Config.authentication.authenticationTokenLifetime,
          },
        });
  
        return authenticationToken;
  
      },
    },
    'identity': {
      method: 'get',
      path: '/authentication/identity',
      requiresAuthentication: true,
      handler: ({ user, userPermissions }) => {
        return {
          ...user,
          permissions: userPermissions,
        };
      },
    },
  });

}