import type { IUnifiedApp, IUnifiedAction, IUnifiedMiddleware, IUnifiedAppListen } from './interfaces.d.ts';


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    actions: [],
    middlewares: [],
    addAction: (route: IUnifiedAction) => {
      app.actions!.push(route);
    },
    addMiddleware: (middleware: IUnifiedMiddleware) => {
      app.middlewares!.push(middleware);
    },
    listen: (options: IUnifiedAppListen) => {
      console.log(`listening on ${options.port}`);
    },
  };

  return app as IUnifiedApp;

}
