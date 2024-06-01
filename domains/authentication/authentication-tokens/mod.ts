import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAuthenticationTokenBase {
  user: string;
  token: string;
  validUntil: number;
}

export interface IAuthenticationToken extends IAuthenticationTokenBase, IBaseDocument {}


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

  app.authenticationTokens = createUnifiedController<IAuthenticationTokenBase>('AuthenticationToken', AuthenticationTokenSchema);


  app.addAction({
    template: 'list',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'count',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'create',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'update',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'replace',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

  app.addAction({
    template: 'delete',
    controller: app.authenticationTokens,
    pathPrefix: '/authentication-tokens',
  });

}