import { IPayticket } from './interfaces.d.ts';


export interface IPaymentGatewayHandler {
  gateway: string;
  initialize: (payticket: IPayticket) => Promise<IPayticket> // fills payticket.payUrl and returns it
  verify: (payticket: IPayticket) => Promise<void> // verifies tickets payment and throws in error
}


const gatewayHandlers: IPaymentGatewayHandler[] = [];

export function registerPayticketGateway(gatewayHandler: IPaymentGatewayHandler) {
  if (gatewayHandlers.find(it => it.gateway === gatewayHandler.gateway)) {
    throw new Error(`this gateway handler is already defined ${gatewayHandler.gateway}`);
  }

  gatewayHandlers.push(gatewayHandler);

}

export function getGatewayHandler(gateway: string): IPaymentGatewayHandler {

  const handler = gatewayHandlers.find(it => it.gateway === gateway);
  if (!handler) {
    throw new Error(`gateway handler for ${gateway} is not defiend`);
  }

  return handler;

}
