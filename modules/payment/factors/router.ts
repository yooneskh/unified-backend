import { FactorMaker } from './resource.ts';
import './controller.ts';


FactorMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.payment.factor.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.payment.factor.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.payment.factor.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.payment.factor.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.payment.factor.update',
    stateValidators: [
      async ({ resourceId, controller, hasPermission }) => {
        const factor = await controller.retrieve({ resourceId });
        if (factor.payed && !hasPermission('special.payment.factor.update-payed')) {
          throw new Error(`factor ${factor.name} is payed`);
        }
      }
    ]
  },
  'delete': {
    template: 'delete',
    permission: 'admin.payment.factor.delete',
    stateValidators: [
      async ({ resourceId, controller, hasPermission }) => {
        const factor = await controller.retrieve({ resourceId });
        if (factor.payed && !hasPermission('special.payment.factor.delete-payed')) {
          throw new Error(`factor ${factor.name} is payed`);
        }
      }
    ]
  }
});


export const FactorRouter = FactorMaker.getRouter();
