import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAuthenticationTokenBase {
  user: string;
  token: string;
  validUntil: number;
} export interface IAuthenticationToken extends IAuthenticationTokenBase, IBaseDocument {}

const AuthenticationTokenSchema: IUnifiedModel<IAuthenticationTokenBase> = {
  user: {
    type: 'string',
    ref: 'User',
    required: true,
  },
  token: {
    type: 'string',
    required: true,
  },
  validUntil: {
    type: 'number',
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    authenticationTokens: IUnifiedController<IAuthenticationTokenBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('AuthenticationToken', AuthenticationTokenSchema);

  app.authenticationTokens = createUnifiedController<IAuthenticationTokenBase>(app, 'AuthenticationToken', AuthenticationTokenSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/authentication-tokens/meta',
      requirePermission: 'admin.authentication.authentication-tokens.meta',
      handler: () => {
        return app.models['AuthenticationToken'];
      },
    },
    'list': {
      template: 'list',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.list',
    },
    'count': {
      template: 'count',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.create',
    },
    'update': {
      template: 'update',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.update',
    },
    'replace': {
      template: 'replace',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.authenticationTokens,
      pathPrefix: '/authentication-tokens',
      requirePermission: 'admin.authentication.authentication-tokens.delete',
    },
  });

}