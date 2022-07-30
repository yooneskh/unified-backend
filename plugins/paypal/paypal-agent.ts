

export interface IPaypalAgentPaymentRequest {
  sandbox?: boolean;
  username: string;
  password: string;
  currency: string;
  amount: number;
  returnUrl: string;
}

export async function createPaypalPaymentRequest(config: IPaypalAgentPaymentRequest) {

  const urlBase = config.sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
  const authorization = btoa(`${config.username}:${config.password}`);

  const payload = {
    intent: 'CAPTURE',
    application_context: {
      return_url: config.returnUrl
    },
    purchase_units: [
      {
        amount: {
          currency_code: config.currency,
          value: String(config.amount)
        }
      }
    ]
  };


  const response = await fetch(`${urlBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authorization}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status !== 201) {
    throw new Error(`could not create paypal order. ${await response.text()}`);
  }


  const data = await response.json();
  const approvalLink = data.links.find((it: { rel?: string; href?: string; }) => it.rel === 'approve')?.href;

  if (!approvalLink) {
    throw new Error(`paypal order did not have approval link. ${JSON.stringify(data)}`);
  }


  return {
    orderId: data.id,
    url: approvalLink
  }

}


export interface IPaypalAgentPaymentFinalize {
  sandbox?: boolean;
  username: string;
  password: string;
  orderId: string
}

export async function finalizePaypalPaymentRequest(config: IPaypalAgentPaymentFinalize) {

  const urlBase = config.sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
  const authorization = btoa(`${config.username}:${config.password}`);

  const retrieveResponse = await fetch(`${urlBase}/v2/checkout/orders/${config.orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${authorization}`,
      'Content-Type': 'application/json'
    }
  });

  if (retrieveResponse.status !== 200) {
    throw new Error(`could not retrieve paypal order. ${await retrieveResponse.text()}`);
  }


  const order = await retrieveResponse.json();

  if (order.id !== config.orderId) {
    throw new Error(`retrieved paypal order id "${order.id}" is not equal to requested id "${config.orderId}"`);
  }

  if (order.status !== 'APPROVED') {
    throw new Error(`retrieved paypal order status "${order.status}" is not "APPROVED"`);
  }


  const captureResponse = await fetch(`${urlBase}/v2/checkout/orders/${config.orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authorization}`,
      'Content-Type': 'application/json'
    }
  });

  if (captureResponse.status !== 201) {
    throw new Error(`could not capture paypal order. ${await captureResponse.text()}`);
  }

  const capturedOrder = await captureResponse.json();

  if (capturedOrder.status !== 'COMPLETED') {
    throw new Error(`captured paypal order status "${capturedOrder.status}" is not "COMPLETED"`);
  }

}
