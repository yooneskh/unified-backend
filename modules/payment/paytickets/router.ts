import { PayticketMaker } from './resource.ts';
import { createPayticket } from './controller.ts';
import { FactorController } from '../factors/controller.ts';
import { EventEmitter } from '../../../services/event-emitter.ts';
import { makePaymentSuccessPage } from '../payment-results/success.ts';
import { Config } from '../../../config.ts';
import { makePaymentErrorPage } from '../payment-results/error.ts';
import { getGatewayHandler } from './gateways.ts';
import { BypassRouteError } from '../../../plugins/error/handleable-error.ts';
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
      async ({ resourceId, controller, response }) => {

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
        catch (error: unknown) {

          response.header('content-type', 'text/html');

          response.send(
            makePaymentErrorPage({
              title: Config.payment.default.title,
              reason: (error as Record<string, unknown>)?.responseMessage as string || (error as Record<string, unknown>)?.message as string || 'An error occured',
              // deno-lint-ignore no-explicit-any
              locale: payticket.locale as any,
              callback: Config.payment.default.callback,
              callbackSupport: Config.payment.default.supportCallback
            })
          );

          throw new BypassRouteError('payticket state invalid');

        }

      }
    ],
    handler: async ({ resourceId, controller, response }) => {

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

        response.header('content-type', 'text/html');

        response.send(
          makePaymentSuccessPage({
            title: Config.payment.default.title,
            heading: `${payticket.amount.toLocaleString()} تومان`,
            reason: factor.name,
            // deno-lint-ignore no-explicit-any
            locale: payticket.locale as any,
            callbackUrl: payticket.returnUrl || Config.payment.default.callback
          })
        );

      }
      catch (error: unknown) {

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

        response.header('content-type', 'text/html');

        response.send(
          makePaymentErrorPage({
            title: Config.payment.default.title,
            reason: (error as Record<string, unknown>).responseMessage as string || (error as Record<string, unknown>).message as string || 'An error occured',
            // deno-lint-ignore no-explicit-any
            locale: payticket.locale as any,
            callback: Config.payment.default.callback,
            callbackSupport: Config.payment.default.supportCallback
          })
        );

      }

    }
  }
});


export const PayticketRouter = PayticketMaker.getRouter();
