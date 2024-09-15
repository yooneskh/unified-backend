import type { IUnifiedApp } from './interfaces.d.ts';
import { joinPaths } from './utils/join-paths.ts';
import { makeRequestHandler } from './utils/request-handler.ts';


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    pathStack: [],
    actions: [],
    middlewares: [],
    postwares: [],
    actionProcessors: [],
    pathPush: (segment) => {
      app.pathStack!.push(segment);
    },
    pathPop: () => {
      return app.pathStack!.pop();
    },
    addActions: (routes) => {
      for (const route of Object.values(routes)) {

        if (route.path) {
          route.path = '/' + joinPaths(...app.pathStack!, route.path);
        }
          
        if (route.pathPrefix) {
          route.pathPrefix = '/' + joinPaths(...app.pathStack!, route.pathPrefix);
        }
  
        app.actions!.push(route);

      }
    },
    addMiddlewares: (middlewares) => {
      for (const middleware of Object.values(middlewares)) {
        app.middlewares!.push(middleware);
      }
    },
    addPostwares: (postwares) => {
      for (const postware of Object.values(postwares)) {
        app.postwares!.push(postware);
      }
    },
    addActionProcessors: (processors) => {
      for (const processor of Object.values(processors)) {
        app.actionProcessors!.push(processor);
      }
    },
    listen: (options) => {

      for (const action of app.actions!) {
        for (const processor of app.actionProcessors!) {
          processor(action);
        }
      }


      const handler = makeRequestHandler(app as IUnifiedApp, app.actions!);

      return Deno.serve(options, handler);

    },
  };

  return app as IUnifiedApp;

}
