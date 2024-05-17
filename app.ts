import { createUnifiedApp, IUnifiedApp } from 'unified-app';
import { install as installUnifiedResources } from './layers/unified-resources/mod.ts';
import { install as installAuthentication } from './domains/authentication/mod.ts';


export function createApp(): IUnifiedApp {

  const app = createUnifiedApp();


  installUnifiedResources(app);

  installAuthentication(app);


  return app;

}
