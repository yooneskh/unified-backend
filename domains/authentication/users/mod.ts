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


  app.addAction({
    method: 'get',
    path: '/users/meta',
    requirePermission: 'admin.authentication.users.meta',
    handler: () => {
      return app.models['User'];
    },
  });

  app.addAction({
    template: 'list',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.list',
  });

  app.addAction({
    template: 'count',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.count',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.retrieve',
  });

  app.addAction({
    template: 'create',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.create',
  });

  app.addAction({
    template: 'update',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.update',
  });

  app.addAction({
    template: 'replace',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.replace',
  });

  app.addAction({
    template: 'delete',
    controller: app.users,
    pathPrefix: '/users',
    requirePermission: 'admin.authentication.users.delete',
  });

}