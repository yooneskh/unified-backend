import { Config } from 'config';
import { UserController } from '../../users/controller.ts';
import { FactorController } from '../factors/controller.ts';
import { registerPayticketGateway } from './gateways.ts';
import { PayticketController } from './controller.ts';
import { makeZarinpalRequest, verifyZarinpalRequest } from '../../../plugins/zarinpal/zarinpal-agent.ts';


registerPayticketGateway({
  gateway: 'zarinpal',
  initialize: async payticket => {

    const { amount } = payticket;
    const callbackUrl = `${Config.payment.core.verificationCallback}/${payticket._id}/verify`;
    const factor = await FactorController.retrieve({ resourceId: payticket.factor });
    const description = factor.name;

    let userMobile = undefined;
    let userEmail = undefined;

    if (factor.user) {
      const user = await UserController.retrieve({ resourceId: factor.user });
      userMobile = user.phoneNumber;
      userEmail = user.email;
    }


    const { status, authority, payUrl } = await makeZarinpalRequest({
      sandbox: Config.payment.zarinpal.sandbox,
      merchantId: Config.payment.zarinpal.merchantId,
      amount: String(amount),
      callbackUrl,
      description,
      email: userEmail,
      mobile: userMobile
    });

    if (status !== 100) {
      throw new Error('zarinpal gateway error');
    }


    return PayticketController.update({
      resourceId: payticket._id,
      payload: {
        payUrl,
        meta: {
          status,
          authority,
          callbackUrl
        }
      }
    });

  },
  verify: async payticket => {

    const amount = payticket.amount;
    const authority = payticket.meta?.authority as string | undefined;

    if (!amount || !authority) throw new Error('invalid zarinpal payticket');


    const { status } = await verifyZarinpalRequest({
      sandbox: Config.payment.zarinpal.sandbox,
      merchantId: Config.payment.zarinpal.merchantId,
      amount,
      authority
    });

    await PayticketController.update({
      resourceId: payticket._id,
      payload: {
        meta: {
          ...(payticket.meta || {}),
          verificationStatus: status
        }
      }
    });

    if (status !== 100) {
      throw new Error('zarinpal did not verify');
    }

  }
});
