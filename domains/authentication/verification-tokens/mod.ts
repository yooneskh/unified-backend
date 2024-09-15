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


  app.addActions({
    'meta': {
      method: 'get',
      path: '/verification-tokens/meta',
      requirePermission: 'admin.authentication.verification-tokens.meta',
      handler: () => {
        return app.models['VerificationToken'];
      },
    },
    'list': {
      template: 'list',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.list',
    },
    'count': {
      template: 'count',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.create',
    },
    'update': {
      template: 'update',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.update',
    },
    'replace': {
      template: 'replace',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.verificationTokens,
      pathPrefix: '/verification-tokens',
      requirePermission: 'admin.authentication.verification-tokens.delete',
    },
  });

}