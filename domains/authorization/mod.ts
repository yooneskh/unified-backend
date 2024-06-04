import { Config } from 'config';
import { IUnifiedApp } from 'unified-app';
import { install as installAuthorizationTokens } from './authorization-roles/mod.ts';
import { install as installAuthorizationRoles } from './authorization-tokens/mod.ts';
import { wildcardIncludes } from './utils/permission-includes.ts';
import type { IAuthorizationRole } from './authorization-roles/mod.ts';


declare module 'unified-app' {

  interface IUnifiedActionContext {
    userPermissions?: string[];
  }

  interface IUnifiedAction {
    requirePermission?: string;
    requirePermissions?: string[];
  }

}


export function install(app: IUnifiedApp) {
  
  installAuthorizationRoles(app);
  installAuthorizationTokens(app);


  Promise.all(
    Config.authorization.prepopulateUsers.map(async user => {

      const userExists = await app.users.exists({
        filter: {
          email: user.email,
        },
      });

      if (userExists) {
        return;
      }


      const newUser = await app.users.create({
        document: {
          name: user.name,
          email: user.email,
        },
      });

      await app.authorizationTokens.create({
        document: {
          user: newUser._id,
          permissions: user.permissions,
        },
      });

    })
  );


  app.addMiddleware(async context => {

    if (context.user) {

      const allTokens = await app.authorizationTokens.list({
        filter: {
          user: context.user!._id,
        },
        populate: {
          'roles': [ 'permissions' ],
        },
      });

      if (allTokens.length === 0) {

        const newAuthorizationToken = await app.authorizationTokens.create({
          document: {
            user: context.user!._id,
            permissions: Config.authorization.userDefaultPermissions,
          },
        });

        allTokens.push(newAuthorizationToken);

      }

      context.userPermissions = [...new Set( allTokens.map(it => [ it.permissions, (it.roles as unknown as IAuthorizationRole[])?.map(x => x.permissions) ] ).flat(3) )].filter(Boolean);

    }


    if (context.action.requirePermission && !wildcardIncludes(context.userPermissions, context.action.requirePermission)) {
      throw new Error('invalid permissions');
    }

    if (context.action.requirePermissions && !context.action.requirePermissions.every(it => wildcardIncludes(context.userPermissions, it))) {
      throw new Error('invalid permissions');
    }

  });


}