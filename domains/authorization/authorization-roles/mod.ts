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

  app.authorizationRoles = createUnifiedController<IAuthorizationRoleBase>('AuthorizationRole', AuthorizationRoleSchema);


  app.addAction({
    template: 'list',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.list',
  });

  app.addAction({
    template: 'count',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.retrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.create',
  });

  app.addAction({
    template: 'update',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.update',
  });

  app.addAction({
    template: 'replace',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.replace',
  });

  app.addAction({
    template: 'delete',
    controller: app.authorizationRoles,
    pathPrefix: '/authorization-roles',
    requirePermission: 'admin.authorization.authorization-roles.delete',
  });

}