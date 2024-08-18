import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAuthorizationTokenBase {
  user: string;
  permissions: string[];
  roles?: string[];
} export interface IAuthorizationToken extends IAuthorizationTokenBase, IBaseDocument {}

const AuthorizationTokenSchema: IUnifiedModel<IAuthorizationTokenBase> = {
  user: {
    type: 'string',
    ref: 'User',
    required: true,
  },
  permissions: {
    type: 'string',
    array: true,
    required: true,
  },
  roles: {
    type: 'string',
    ref: 'AuthorizationRole',
    array: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    authorizationTokens: IUnifiedController<IAuthorizationTokenBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('AuthorizationToken', AuthorizationTokenSchema);

  app.authorizationTokens = createUnifiedController<IAuthorizationTokenBase>(app, 'AuthorizationToken', AuthorizationTokenSchema);


  app.addAction({
    method: 'get',
    path: '/authorization-tokens/meta',
    requirePermission: 'admin.authorization.authorization-tokens.meta',
    handler: () => {
      return app.models['AuthorizationToken'];
    },
  });

  app.addAction({
    template: 'list',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.list',
  });

  app.addAction({
    template: 'count',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.retrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.create',
  });

  app.addAction({
    template: 'update',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.update',
  });

  app.addAction({
    template: 'replace',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.replace',
  });

  app.addAction({
    template: 'delete',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokens.delete',
  });

}