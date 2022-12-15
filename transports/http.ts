import { NHttp } from '../deps.ts';

const app = new NHttp();


/* global plugins */

app.get('/ping', () => 'pong');

app.use((revt, next) => {

  revt.response.header('Access-Control-Allow-Origin', '*');
  revt.response.header('Access-Control-Allow-Headers', '*');
  revt.response.header('Access-Control-Allow-Methods', '*');

  if (revt.request.method === 'OPTIONS') {
    return revt.response.status(200).send('OK');
  }
  else {
    return next();
  }

});


import '../plugins/router-provider/addon.ts';
import '../plugins/router-rest-templates/addon.ts';
import '../modules/authentication/lib/router-addon.ts';
import '../modules/authorization/lib/router-addon.ts';
import '../plugins/router-validators/addon.ts';


// import { setGlobalRateLimit } from '../plugins/rate-limiter/rate-limiter-router-addon.ts';
// setGlobalRateLimit({
//   points: 30,
//   windowDuration: 1,
//   blockDuration: 10
// });


import { CaptchaTokenRouter } from '../plugins/svg-captcha/captcha-tokens/router.ts';
app.use('/api/captcha-tokens', CaptchaTokenRouter);

import '../plugins/svg-captcha/router-addon.ts';


/* global modules */

import { UserRouter } from '../modules/users/router.ts';
app.use('/api/users', UserRouter);


import { AuthenticationRouter } from '../modules/authentication/authentication-router/router.ts';
import { AuthenticationTokenRouter } from '../modules/authentication/authentication-tokens/router.ts';
import { RegisterTokenRouter } from '../modules/authentication/register-tokens/router.ts';
import { VerificationTokenRouter } from '../modules/authentication/verification-tokens/router.ts';
app.use('/api/authentication', AuthenticationRouter);
app.use('/api/authentication-tokens', AuthenticationTokenRouter);
app.use('/api/register-tokens', RegisterTokenRouter);
app.use('/api/verification-tokens', VerificationTokenRouter);

import '../modules/authentication/providers/email.ts'
import '../modules/authentication/providers/phone.ts';

import '../modules/authentication/lib/listeners.ts';


import { AuthorizationTokenRouter } from '../modules/authorization/authorization-tokens/router.ts';
import { AuthorizationRoleRouter } from '../modules/authorization/authorization-roles/router.ts';
app.use('/api/authorization-tokens', AuthorizationTokenRouter);
app.use('/api/authorization-roles', AuthorizationRoleRouter);


import { MediaRouter } from '../modules/media/router.ts';
app.use('/api/media', MediaRouter);

import '../modules/media/lib/validators.ts';
import '../modules/media/lib/addons.ts';


import { FactorRouter } from '../modules/payment/factors/router.ts';
import { PayticketRouter } from '../modules/payment/paytickets/router.ts';
app.use('/api/factors', FactorRouter);
app.use('/api/paytickets', PayticketRouter);

import '../modules/payment/paytickets/gateway-zarinpal.ts';


import { AccountRouter } from '../modules/accounting/accounts/router.ts';
import { TransferRouter } from '../modules/accounting/transfers/router.ts';
app.use('/api/accounts', AccountRouter);
app.use('/api/transfers', TransferRouter);

import '../modules/accounting/accounts/lib/bootstrap.ts';


import { ApplicationSettingRouter } from '../modules/application-settings/router.ts';
app.use('/api/application-settings', ApplicationSettingRouter);


import '../modules/notifications/sms-notification-manager.ts';


/* extra */

import { handleNHttpError } from '../plugins/error/handleable-error.ts';
app.onError(handleNHttpError);
app.on404(rev => rev.response.status(404).send(`${rev.request.method} at ${rev.request.url} was not found.`));


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
