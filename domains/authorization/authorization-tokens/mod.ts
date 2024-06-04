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

  app.authorizationTokens = createUnifiedController<IAuthorizationTokenBase>('AuthorizationToken', AuthorizationTokenSchema);


  app.addAction({
    template: 'list',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokensles.list',
  });

  app.addAction({
    template: 'count',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokenses.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-rolestokensretrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokenss.create',
  });

  app.addAction({
    template: 'update',
    controller: app.authorizationTokens,
    pathPrefix: '/authorization-tokens',
    requirePermission: 'admin.authorization.authorization-tokenss.update',
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
    requirePermission: 'admin.authorization.authorization-tokenss.delete',
  });

}