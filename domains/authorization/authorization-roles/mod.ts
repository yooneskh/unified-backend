import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAuthorizationRoleBase {
  name: string;
  permissions: string[];
} export interface IAuthorizationRole extends IAuthorizationRoleBase, IBaseDocument {}

const AuthorizationRoleSchema: IUnifiedModel<IAuthorizationRoleBase> = {
  name: {
    type: 'string',
    required: true,
  },
  permissions: {
    type: 'string',
    array: true,
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    authorizationRoles: IUnifiedController<IAuthorizationRoleBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('AuthorizationRole', AuthorizationRoleSchema);

  app.authorizationRoles = createUnifiedController<IAuthorizationRoleBase>(app, 'AuthorizationRole', AuthorizationRoleSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/authorization-roles/meta',
      requirePermission: 'admin.authorization.authorization-roles.meta',
      handler: () => {
        return app.models['AuthorizationRole'];
      },
    },
    'list': {
      template: 'list',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.list',
    },
    'count': {
      template: 'count',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.create',
    },
    'update': {
      template: 'update',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.update',
    },
    'replace': {
      template: 'replace',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.authorizationRoles,
      pathPrefix: '/authorization-roles',
      requirePermission: 'admin.authorization.authorization-roles.delete',
    },
  });

}