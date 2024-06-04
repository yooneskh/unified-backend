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

  app.verificationTokens = createUnifiedController<IVerificationTokenBase>('VerificationToken', VerificationTokenSchema);


  app.addAction({
    template: 'list',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'count',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'create',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'update',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'replace',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

  app.addAction({
    template: 'delete',
    controller: app.verificationTokens,
    pathPrefix: '/verification-tokens',
  });

}