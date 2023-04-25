import { UnifiedWebServer } from '../deps.ts';

const app = new UnifiedWebServer();


/* global plugins */

app.route({
  method: 'get',
  path: '/ping',
  handler: () => 'pong',
});


import '../plugins/router-provider/addon.ts';
import '../plugins/router-rest-templates/addon.ts';
import '../domains/authentication/lib/router-addon.ts';
import '../domains/authorization/lib/router-addon.ts';
import '../plugins/router-validators/addon.ts';


import { CaptchaTokenRouter } from '../domains/captcha-tokens/router.ts';
app.use('/api/captcha-tokens', CaptchaTokenRouter);

import '../domains/captcha-tokens/router-addon.ts';


/* global modules */

import { UserRouter } from '../domains/users/router.ts';
app.use('/api/users', UserRouter);


import { AuthenticationRouter } from '../domains/authentication/authentication-router/router.ts';
import { AuthenticationTokenRouter } from '../domains/authentication/authentication-tokens/router.ts';
import { RegisterTokenRouter } from '../domains/authentication/register-tokens/router.ts';
import { VerificationTokenRouter } from '../domains/authentication/verification-tokens/router.ts';
app.use('/api/authentication', AuthenticationRouter);
app.use('/api/authentication-tokens', AuthenticationTokenRouter);
app.use('/api/register-tokens', RegisterTokenRouter);
app.use('/api/verification-tokens', VerificationTokenRouter);

import '../domains/authentication/providers/email.ts'
import '../domains/authentication/providers/phone.ts';

import '../domains/authentication/lib/listeners.ts';


import { AuthorizationTokenRouter } from '../domains/authorization/authorization-tokens/router.ts';
import { AuthorizationRoleRouter } from '../domains/authorization/authorization-roles/router.ts';
app.use('/api/authorization-tokens', AuthorizationTokenRouter);
app.use('/api/authorization-roles', AuthorizationRoleRouter);


import { MediaRouter } from '../domains/media/router.ts';
app.use('/api/media', MediaRouter);

import '../domains/media/lib/validators.ts';
import '../domains/media/lib/addons.ts';


import { FactorRouter } from '../domains/payment/factors/router.ts';
import { PayticketRouter } from '../domains/payment/paytickets/router.ts';
app.use('/api/factors', FactorRouter);
app.use('/api/paytickets', PayticketRouter);

import '../domains/payment/paytickets/gateway-zarinpal.ts';


import { AccountRouter } from '../domains/accounting/accounts/router.ts';
import { TransferRouter } from '../domains/accounting/transfers/router.ts';
app.use('/api/accounts', AccountRouter);
app.use('/api/transfers', TransferRouter);

import '../domains/accounting/accounts/lib/bootstrap.ts';


import { ApplicationSettingRouter } from '../domains/application-settings/router.ts';
app.use('/api/application-settings', ApplicationSettingRouter);


import '../domains/notifications/sms-notification-manager.ts';


/* extra */

import { handleWebserverError } from '../plugins/error/handleable-error.ts';
app.setErrorHandler(handleWebserverError);


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen({
    port,
    onListen: afterListenCallback,
  });
}
