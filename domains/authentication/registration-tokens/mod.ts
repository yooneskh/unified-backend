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


  app.addActions({
    'meta': {
      method: 'get',
      path: '/registration-tokens/meta',
      requirePermission: 'admin.authentication.registration-tokens.meta',
      handler: () => {
        return app.models['RegistrationToken'];
      },
    },
    'list': {
      template: 'list',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.list',
    },
    'count': {
      template: 'count',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.create',
    },
    'update': {
      template: 'update',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.update',
    },
    'replace': {
      template: 'replace',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.registrationTokens,
      pathPrefix: '/registration-tokens',
      requirePermission: 'admin.authentication.registration-tokens.delete',
    },
  });

}