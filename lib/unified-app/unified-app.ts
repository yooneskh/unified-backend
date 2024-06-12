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
    listeners: [],
    pathPush: (segment) => {
      app.pathStack!.push(segment);
    },
    pathPop: () => {
      return app.pathStack!.pop();
    },
    addAction: (route) => {

      if (route.path) {
        route.path = '/' + joinPaths(...app.pathStack!, route.path);
      }
        
      if (route.pathPrefix) {
        route.pathPrefix = '/' + joinPaths(...app.pathStack!, route.pathPrefix);
      }

      app.actions!.push(route);

    },
    addMiddleware: (middleware) => {
      app.middlewares!.push(middleware);
    },
    addPostware: (postware) => {
      app.postwares!.push(postware);
    },
    addActionProcessor: (processor) => {
      app.actionProcessors!.push(processor);
    },
    on: (event, callback) => {
      app.listeners!.push({
        event,
        callback,
      });
    },
    emit: (event, ...args) => {
      for (const listener of app.listeners!) {
        if (listener.event === event) {
          listener.callback(...args);
        }
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
