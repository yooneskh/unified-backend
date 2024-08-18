import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IVerificationTokenBase {
  user?: string;
  registrationToken?: string;
  code: string;
  validUntil: number;
} export interface IVerificationToken extends IVerificationTokenBase, IBaseDocument {}

const VerificationTokenSchema: IUnifiedModel<IVerificationTokenBase> = {
  user: {
    type: 'string',
    ref: 'User',
  },
  registrationToken: {
    type: 'string',
    ref: 'RegistrationToken',
  },
  code: {
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
    verificationTokens: IUnifiedController<IVerificationTokenBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('VerificationToken', VerificationTokenSchema);

  app.verificationTokens = createUnifiedController<IVerificationTokenBase>(app, 'VerificationToken', VerificationTokenSchema);


  app.addAction({
    method: 'get',
    path: '/verification-tokens/meta',
    requirePermission: 'admin.authentication.verification-tokens.meta',
    handler: () => {
      return app.models['VerificationToken'];
    },
  });

  app.addAction({
    template: 'list',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.list',
  });

  app.addAction({
    template: 'count',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.retrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.create',
  });

  app.addAction({
    template: 'update',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.update',
  });

  app.addAction({
    template: 'replace',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.replace',
  });

  app.addAction({
    template: 'delete',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
    requirePermission: 'admin.authentication.verification-tokens.delete',
  });

}