import { createUnifiedApp, IUnifiedApp } from 'unified-app';
import { install as installUnifiedCommons } from './layers/unified-commons/mod.ts';
import { install as installUtilities } from './domains/utilities/mod.ts';
import { install as installAuthentication } from './domains/authentication/mod.ts';
import { install as installAuthorization } from './domains/authorization/mod.ts';
import { install as installMedia } from './domains/media/mod.ts';
import { install as installApplicationSettings } from './domains/settings/application-settings.ts';


export function createApp(): IUnifiedApp {

  const app = createUnifiedApp();
  app.pathPush('api');


  /* general */

  installUnifiedCommons(app);
  installUtilities(app);

  installAuthentication(app);
  installAuthorization(app);
  installMedia(app);


  /* app specific */

  installApplicationSettings(app);


  app.pathPop();
  return app;

}
