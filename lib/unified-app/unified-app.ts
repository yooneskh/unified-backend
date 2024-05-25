import type { IUnifiedApp, IUnifiedAction, IUnifiedMiddleware, IUnifiedAppListen, IUnifiedProcessor } from './interfaces.d.ts';


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    actions: [],
    middlewares: [],
    actionProcessors: [],
    addAction: (route: IUnifiedAction) => {
      app.actions!.push(route);
    },
    addMiddleware: (middleware: IUnifiedMiddleware) => {
      app.middlewares!.push(middleware);
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

      console.log(`listening on ${options.port}`);

    },
  };

  return app as IUnifiedApp;

}
