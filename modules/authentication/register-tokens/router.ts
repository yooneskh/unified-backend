import { RegisterTokenMaker } from './resource.ts';
import './controller.ts';


RegisterTokenMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.authentication.register-token.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.authentication.register-token.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.authentication.register-token.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.authentication.register-token.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.authentication.register-token.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.authentication.register-token.delete'
  }
});


export const RegisterTokenRouter = RegisterTokenMaker.getRouter();
