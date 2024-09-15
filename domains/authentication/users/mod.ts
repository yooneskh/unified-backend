import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IUserBase {
  email: string;
} export interface IUser extends IUserBase, IBaseDocument {}

const UserSchema: IUnifiedModel<IUserBase> = {
  email: {
    type: 'string',
    required: true,
    titleable: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    users: IUnifiedController<IUserBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('User', UserSchema);

  app.users = createUnifiedController<IUserBase>(app, 'User', UserSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/users/meta',
      requirePermission: 'admin.authentication.users.meta',
      handler: () => {
        return app.models['User'];
      },
    },
    'list': {
      template: 'list',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.list',
    },
    'count': {
      template: 'count',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.create',
    },
    'update': {
      template: 'update',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.update',
    },
    'replace': {
      template: 'replace',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.users,
      pathPrefix: '/users',
      requirePermission: 'admin.authentication.users.delete',
    },
  });

}