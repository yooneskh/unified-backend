import { AuthorizationRoleMaker } from './resource.ts';
import './controller.ts';


AuthorizationRoleMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.authorization.authorization-role.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.authorization.authorization-role.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.authorization.authorization-role.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.authorization.authorization-role.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.authorization.authorization-role.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.authorization.authorization-role.delete'
  }
});


export const AuthorizationRoleRouter = AuthorizationRoleMaker.getRouter();
