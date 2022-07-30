import { VerificationTokenMaker } from './resource.ts';
import './controller.ts';


VerificationTokenMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.authentication.verification-token.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.authentication.verification-token.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.authentication.verification-token.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.authentication.verification-token.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.authentication.verification-token.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.authentication.verification-token.delete'
  }
});


export const VerificationTokenRouter = VerificationTokenMaker.getRouter();
