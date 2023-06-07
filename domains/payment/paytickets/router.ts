import { PayticketMaker } from './resource.ts';
import { createPayticket } from './controller.ts';
import { FactorController } from '../factors/controller.ts';
import { EventEmitter } from '../../../services/event-emitter.ts';
import { makePaymentSuccessPage } from '../payment-results/success.ts';
import { Config } from 'config';
import { makePaymentErrorPage } from '../payment-results/error.ts';
import { getGatewayHandler } from './gateways.ts';
import { getAccountForUser } from '../../accounting/accounts/controller.ts';
import { createTransfer, getGlobalSourceAccount } from '../../accounting/transfers/controller.ts';


PayticketMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.payment.payticket.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.payment.payticket.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.payment.payticket.retrieve'
  },
  'create': {
    signal: 'Route.Payticket.Create',
    method: 'post',
    path: '/',
    permission: 'admin.payment.payticket.create',
    provider: async ({ payload }) => {

      const payticket = await createPayticket({
        factorId: payload.factor,
        gateway: payload.gateway,
        returnUrl: payload.returnUrl,
        locale: payload.locale
      });

      payticket.meta = {};
      return payticket;

    }
  },
  'update': {
    template: 'update',
    permission: 'admin.payment.payticket.update',
    stateValidators: [
      async ({ resourceId, controller }) => {
        const payticket = await controller.retrieve({ resourceId });
        if (payticket.resolved || payticket.payed || payticket.rejected) {
          throw new Error('this payticket is finalized');
        }
      }
    ]
  },
  'delete': {
    template: 'delete',
    permission: 'admin.payment.payticket.delete',
    stateValidators: [
      async ({ resourceId, controller }) => {
        const payticket = await controller.retrieve({ resourceId });
        if (payticket.resolved || payticket.payed || payticket.rejected) {
          throw new Error('this payticket is finalized');
        }
      }
    ]
  },
  'verify': {
    signal: 'Route.Payticket.Verify',
    method: 'get',
    path: '/:resourceId/verify',
    stateValidators: [
      async ({ resourceId, controller }) => {

        const payticket = await controller.retrieve({ resourceId });

        try {

          if (payticket.resolved || payticket.payed || payticket.rejected) {
            throw new Error('this payticket is finalized');
          }

          const factor = await FactorController.retrieve({ resourceId: payticket.factor });
          if (factor.payed) {
            throw new Error('factor is already payed');
          }

        }
        catch (error) {

          return new Response(
            makePaymentErrorPage({
              title: Config.payment.default.title,
              reason: error?.responseMessage || error?.message || 'An error occured',
              locale: payticket.locale,
              callback: Config.payment.default.callback,
              callbackSupport: Config.payment.default.supportCallback
            }),
            {
              headers: {
                'content-type': 'text/html',
              }
            }
          )

        }

      }
    ],
    handler: async ({ resourceId, controller }) => {

      const payticket = await controller.retrieve({ resourceId });

      try {

        const handler = getGatewayHandler(payticket.gateway);
        await handler.verify(payticket);

        const updatedPayticket = await controller.update({
          resourceId: payticket._id,
          payload: {
            resolved: true,
            resolvedAt: Date.now(),
            payed: true,
            payedAt: Date.now()
          }
        });

        const factor = await FactorController.update({
          resourceId: payticket.factor,
          payload: {
            payticket: String(payticket._id),
            payed: true,
            payedAt: Date.now()
          }
        });


        if (factor.user) {

          const userAccount = await getAccountForUser(factor.user!);
          const globalSourceAccount = await getGlobalSourceAccount();

          await createTransfer(
            String(globalSourceAccount._id),
            String(userAccount._id),
            factor.amount,
            factor.name
          );

        }


        EventEmitter.emit('Resource.Payticket.Resolved', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Payticket.Payed', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Factor.Payed', String(factor._id), factor);

        return new Response(
          makePaymentSuccessPage({
            title: Config.payment.default.title,
            heading: `${payticket.amount.toLocaleString()} Tomans`,
            reason: factor.name,
            locale: payticket.locale,
            callbackUrl: payticket.returnUrl || Config.payment.default.callback
          }),
          {
            headers: {
              'content-type': 'text/html',
            }
          }
        );

      }
      catch (error) {

        const updatedPayticket = await controller.update({
          resourceId: payticket._id,
          payload: {
            resolved: true,
            resolvedAt: Date.now(),
            rejected: true,
            rejectedAt: Date.now(),
            rejectedFor: (error as Error)?.message
          }
        });

        EventEmitter.emit('Resource.Payticket.Resolved', String(updatedPayticket._id), updatedPayticket);
        EventEmitter.emit('Resource.Payticket.Rejected', String(updatedPayticket._id), updatedPayticket);


        return new Response(
          makePaymentErrorPage({
            title: Config.payment.default.title,
            reason: error?.responseMessage || error?.message || 'An error occured',
            locale: payticket.locale,
            callback: Config.payment.default.callback,
            callbackSupport: Config.payment.default.supportCallback
          }),
          {
            headers: {
              'content-type': 'text/html',
            }
          }
        );

      }

    }
  }
});


export const PayticketRouter = PayticketMaker.getRouter();
