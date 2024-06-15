import { Config } from 'config';


export interface LookupSMSOptions {
  receptor: string;
  template: string;
  token: string;
  token2?: string;
  token3?: string;
  token10?: string; // can have 4 seperators, must have %token
  token20?: string; // can have 6 seperators, must have %token
  type?: string;
}

export async function sendLookupSMS(options: LookupSMSOptions) {

  let receptor = options.receptor;

  if (receptor.startsWith('+98')) {
    receptor = '0' + receptor.slice(3);
  }

  let url = `https://api.kavenegar.com/v1/${Config.kavenegar.apiKey}/verify/lookup.json?receptor=${receptor}&template=${options.template}&token=${encodeURIComponent(options.token)}&type=${options.type ?? 'sms'}`;
  if (options.token2) url += `&token2=${encodeURIComponent(options.token2)}`;
  if (options.token3) url += `&token3=${encodeURIComponent(options.token3)}`;
  if (options.token10) url += `&token10=${encodeURIComponent(options.token10)}`;
  if (options.token20) url += `&token20=${encodeURIComponent(options.token20)}`;

  const response = await fetch(url);
  if (response.status !== 200) throw new Error(`could not send lookup sms ${JSON.stringify(options)} -- ${await response.text()}`);

}


export interface DirectSMSOptions {
  receptors: string[];
  sender: string;
  message: string;
}

export async function sendDirectSMS(options: DirectSMSOptions) {

  const url = `https://api.kavenegar.com/v1/${Config.kavenegar.apiKey}/sms/send.json?receptor=${options.receptors.join(',')}&sender=${options.sender}&message=${encodeURIComponent(options.message)}`;

  const response = await fetch(url);
  if (response.status !== 200) throw new Error(`could not send direct sms ${JSON.stringify(options)} -- ${await response.text()}`);

}
