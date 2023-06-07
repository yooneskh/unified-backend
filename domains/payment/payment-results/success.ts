import { Config } from 'config';
import { makeResultPage } from './base.ts';


interface IPaymentResultSuccess {
  locale?: 'en' | 'fa';
  title: string;
  heading: string;
  reason: string;
  callbackUrl: string;
}

const staticMessages = {
  fa: {
    caption: 'جهت',
    endResult: 'با موفقیت پرداخت شد.',
    view: 'ادامه'
  },
  en: {
    caption: 'For',
    endResult: 'was payed successfully.',
    view: 'Continue'
  }
}

export const makePaymentSuccessPage = ({ locale, title, heading, reason, callbackUrl }: IPaymentResultSuccess) => {

  const messages = staticMessages[locale ?? Config.payment.default.locale];

  return makeResultPage({
    locale,
    title,
    color: '#26de81',
    body: `
      <div id="card">

        <h1>
          ${heading}
        </h1>

        <div class="caption">
          ${messages.caption}
        </div>
        <h2>
          ${reason}
        </h2>
        <p>
          ${messages.endResult}
        </p>

        <a href="${callbackUrl}">
          ${messages.view}
        </a>

      </div>
    `
  });

}
