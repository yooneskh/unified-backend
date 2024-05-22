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
    method: 'get',
    path: '/users/',
    handler: () => {
      return [];
    },
  });


  console.log('installed users resource');

}