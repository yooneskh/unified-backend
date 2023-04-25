import { PayticketMaker } from './resource.ts';
import { IPayticket } from './interfaces.d.ts';
import './model.ts';
import { FactorController } from '../factors/controller.ts';
import { getGatewayHandler } from './gateways.ts';


export const PayticketController = PayticketMaker.getController();


PayticketMaker.addValidations({ });


export interface IPayticketCreation {
  factorId: string;
  gateway: string;
  returnUrl?: string;
  locale?: 'en' | 'fa';
}

export async function createPayticket({ factorId, gateway, returnUrl, locale }: IPayticketCreation): Promise<IPayticket> {

  const factor = await FactorController.retrieve({ resourceId: factorId });
  if (factor.payed) throw new Error('factor is already payed');

  const handler = getGatewayHandler(gateway);
  if (!handler) throw new Error(`gateway not found for ${gateway}`);

  const payticket = await PayticketController.create({
    document: {
      factor: factorId,
      gateway,
      amount: factor.amount,
      returnUrl,
      locale,
      meta: {}
    }
  });

  return handler.initialize(payticket);

}
