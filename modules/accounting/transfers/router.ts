import { TransferMaker } from './resource.ts';
import './controller.ts';
import { createTransfer } from './controller.ts';


TransferMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.accounting.transfer.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.accounting.transfer.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.accounting.transfer.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.accounting.transfer.create',
    provider: ({ payload }) => {
      return createTransfer(
        payload.fromAccount,
        payload.toAccount,
        payload.amount,
        payload.description
      )
    }
  },
  'update': {
    template: 'update',
    permission: 'special.accounting.transfer.update'
  },
  'delete': {
    template: 'delete',
    permission: 'special.accounting.transfer.delete'
  }
});


export const TransferRouter = TransferMaker.getRouter();
