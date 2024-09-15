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


  app.addActions({
    'meta': {
      method: 'get',
      path: '/authorization-tokens/meta',
      requirePermission: 'admin.authorization.authorization-tokens.meta',
      handler: () => {
        return app.models['AuthorizationToken'];
      },
    },
    'list': {
      template: 'list',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.list',
    },
    'count': {
      template: 'count',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.create',
    },
    'update': {
      template: 'update',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.update',
    },
    'replace': {
      template: 'replace',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.authorizationTokens,
      pathPrefix: '/authorization-tokens',
      requirePermission: 'admin.authorization.authorization-tokens.delete',
    },
  });

}