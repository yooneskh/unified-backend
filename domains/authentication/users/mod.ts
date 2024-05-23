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
    handler: ({ query, filter, select, populate, limit, skip }) => {
      if (query['single'] === 'true') {
        return app.users.find({
          filter,
          limit,
          skip,
        });
      }
      else {
        return app.users.list({
          filter,
          limit,
          skip,
        });
      }
    },
  });

  app.addAction({
    method: 'get',
    path: '/users/count',
    handler: ({ filter, limit, skip }) => {
      return app.users.count({
        filter,
        limit,
        skip,
      });
    },
  });

  app.addAction({
    method: 'get',
    path: '/users/:resourceId',
    handler: ({ resourceId, filter, select, populate }) => {
      return app.users.retrieve({
        resourceId,
        filter,
      });
    },
  });

  app.addAction({
    method: 'post',
    path: '/users/',
    handler: ({ body }) => {
      return app.users.create(body);
    },
  });

  app.addAction({
    method: 'patch',
    path: '/users/:resourceId',
    handler: ({ resourceId, filter, body }) => {
      return app.users.update({
        resourceId,
        filter,
        payload: body,
      });
    },
  });

  app.addAction({
    method: 'put',
    path: '/users/:resourceId',
    handler: ({ resourceId, filter, body }) => {
      return app.users.replace({
        resourceId,
        filter,
        document: body,
      });
    },
  });

  app.addAction({
    method: 'delete',
    path: '/users/:resourceId',
    handler: ({ resourceId, filter }) => {
      return app.users.retrieve({
        resourceId,
        filter,
      });
    },
  });


  console.log('installed users resource');

}