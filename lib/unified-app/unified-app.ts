import type { IUnifiedApp, IUnifiedAction, IUnifiedMiddleware, IUnifiedAppListen, IUnifiedProcessor } from './interfaces.d.ts';
import { makeRequestHandler } from './utils/request-handler.ts';


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    actions: [],
    middlewares: [],
    postwares: [],
    actionProcessors: [],
    addAction: (route: IUnifiedAction) => {
      app.actions!.push(route);
    },
    addMiddleware: (middleware: IUnifiedMiddleware) => {
      app.middlewares!.push(middleware);
    },
    addPostware: (postware: IUnifiedMiddleware) => {
      app.postwares!.push(postware);
    },
    addActionProcessor: (processor: IUnifiedProcessor) => {
      app.actionProcessors!.push(processor);
    },
    listen: (options: IUnifiedAppListen) => {

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
