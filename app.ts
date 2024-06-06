import { createUnifiedApp, IUnifiedApp } from 'unified-app';
import { install as installUnifiedLogger } from './layers/unified-logger/mod.ts';
import { install as installUnifiedResources } from './layers/unified-resources/mod.ts';
import { install as installUnifiedCaptcha } from './layers/unified-captcha/mod.ts';
import { install as installAuthentication } from './domains/authentication/mod.ts';
import { install as installAuthorization } from './domains/authorization/mod.ts';
import { install as installMedia } from './domains/media/mod.ts';


export function createApp(): IUnifiedApp {

  const app = createUnifiedApp();


  installUnifiedLogger(app);
  installUnifiedResources(app);
  installUnifiedCaptcha(app);

  installAuthentication(app);
  installAuthorization(app);
  installMedia(app);


  return app;

}
