import { UserMaker } from './resource.ts';
import './controller.ts';


UserMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.user.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.user.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.user.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.user.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.user.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.user.delete'
  }
});


export const UserRouter = UserMaker.getRouter();
