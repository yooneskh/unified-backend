import { AuthenticationTokenMaker } from './resource.ts';
import './controller.ts';


AuthenticationTokenMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.authentication.authentication-token.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.authentication.authentication-token.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.authentication.authentication-token.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.authentication.authentication-token.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.authentication.authentication-token.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.authentication.authentication-token.delete'
  }
});


export const AuthenticationTokenRouter = AuthenticationTokenMaker.getRouter();
