import { createUnifiedApp, IUnifiedApp } from 'unified-app';
import { install as installUnifiedResources } from './layers/unified-resources/mod.ts';
import { install as installAuthentication } from './domains/authentication/mod.ts';
import { install as installMedia } from './domains/media/mod.ts';


export function createApp(): IUnifiedApp {

  const app = createUnifiedApp();


  installUnifiedResources(app);

  installAuthentication(app);
  installMedia(app);


  return app;

}
