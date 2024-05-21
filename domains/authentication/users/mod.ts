import { IUnifiedApp } from 'unified-app';


export function install(app: IUnifiedApp) {

  app.addModel('User', {
    name: {
      type: 'string',
      required: true,
    },
  });


  app.addAction({
    method: 'get',
    path: '/users/',
    handler: () => {
      return [];
    },
  });


  console.log('installed users resource');

}