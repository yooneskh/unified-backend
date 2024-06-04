import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IUserBase {
  name: string;
  email: string;
} export interface IUser extends IUserBase, IBaseDocument {}

const UserSchema: IUnifiedModel<IUserBase> = {
  name: {
    type: 'string',
    required: true,
  },
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

  app.users = createUnifiedController<IUserBase>('User', UserSchema);


  app.addAction({
    template: 'list',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'count',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'retrieve',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'create',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'update',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'replace',
    controller: app.users,
    pathPrefix: '/users',
  });

  app.addAction({
    template: 'delete',
    controller: app.users,
    pathPrefix: '/users',
  });

}