
export interface IZarinpalPaymentRequest {
  merchantId: string;
  sandbox?: boolean;
  amount: string;
  callbackUrl: string;
  description: string;
  email?: string;
  mobile?: string;
}

export async function makeZarinpalRequest(config: IZarinpalPaymentRequest) {

  const urlBase = config.sandbox ? 'https://sandbox.zarinpal.com/pg/rest/WebGate' : 'https://www.zarinpal.com/pg/rest/WebGate';
  const url = `${urlBase}/PaymentRequest.json`;

  const payload = {
    MerchantID: config.merchantId,
    Amount: config.amount,
    CallbackURL: config.callbackUrl,
    Description: config.description,
    Email: config.email,
    Mobile: config.mobile
  };


  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  const { Status, Authority } = data;


  const payUrlBase = config.sandbox ? 'https://sandbox.zarinpal.com/pg/StartPay' : 'https://www.zarinpal.com/pg/StartPay';
  const payUrl = `${payUrlBase}/${data.Authority}`;

  return {
    status: Status,
    authority: Authority,
    payUrl
  };

}


export interface IZarinpalPaymentVerification {
  merchantId: string;
  sandbox?: boolean;
  amount: number;
  authority: string;
}

export async function verifyZarinpalRequest(config: IZarinpalPaymentVerification) {

  const urlBase = config.sandbox ? 'https://sandbox.zarinpal.com/pg/rest/WebGate' : 'https://www.zarinpal.com/pg/rest/WebGate';
  const url = `${urlBase}/PaymentVerification.json`;

  const payload = {
    MerchantID: config.merchantId,
    Amount: config.amount,
    Authority: config.authority
  };


  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  const { Status, RefID } = data;


  return {
    status: Status,
    refId: RefID
  };

}
