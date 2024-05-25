import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import { createUnifiedController } from 'unified-resources';


export interface IUser {
  name: string;
}

export const UserSchema: IUnifiedModel = {
  name: {
    type: 'string',
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    users: IUnifiedController<IUser>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('User', UserSchema);

  app.users = createUnifiedController<IUser>('User', UserSchema);


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