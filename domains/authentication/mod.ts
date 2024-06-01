import { IUnifiedApp } from 'unified-app';
import { install as installUsers } from './users/mod.ts';
import { install as installAuthenticationTokens } from './authentication-tokens/mod.ts';
import { IUser } from './users/mod.ts';


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


  app.addMiddleware(async context => {

    if (context.headers['Authentication']) {

      const authToken = await context.app.authenticationTokens.find({
        filter: {
          token: context.headers['Authentication'],
          validUntil: { $gte: Date.now() },
        },
      });

      if (!authToken) {
        throw new Error('invalid token');
      }


      context.user = await context.app.users.find({
        resourceId: authToken.user,
      });

      if (!context.user) {
        throw new Error('invalid token');
      }

    }

    if (context.action.requiresAuthentication) {
      if (!context.user) {
        throw new Error('you are not authenticated');
      }
    }

  });

}