import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IRegistrationTokenBase {
  userEmail: string;
  validUntil: number;
  resolved: boolean;
} export interface IRegistrationToken extends IRegistrationTokenBase, IBaseDocument {}

const RegistrationTokenSchema: IUnifiedModel<IRegistrationTokenBase> = {
  userEmail: {
    type: 'string',
    required: true,
  },
  validUntil: {
    type: 'number',
    required: true,
  },
  resolved: {
    type: 'boolean',
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    registrationTokens: IUnifiedController<IRegistrationTokenBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('RegistrationToken', RegistrationTokenSchema);

  app.registrationTokens = createUnifiedController<IRegistrationTokenBase>(app, 'RegistrationToken', RegistrationTokenSchema);


  app.addAction({
    method: 'get',
    path: '/registration-tokens/meta',
    requirePermission: 'admin.authentication.registration-tokens.meta',
    handler: () => {
      return app.models['RegistrationToken'];
    },
  });

  app.addAction({
    template: 'list',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.list',
  });

  app.addAction({
    template: 'count',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.retrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.create',
  });

  app.addAction({
    template: 'update',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.update',
  });

  app.addAction({
    template: 'replace',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.replace',
  });

  app.addAction({
    template: 'delete',
    controller: app.registrationTokens,
    pathPrefix: '/registration-tokens',
    requirePermission: 'admin.authentication.registration-tokens.delete',
  });

}