import { IUnifiedApp, IUnifiedAction, IUnifiedAppListen } from './interfaces.d.ts';


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    actions: [],
    addAction: (route: IUnifiedAction) => {
      app.actions!.push(route);
    },
    listen: (options: IUnifiedAppListen) => {
      console.log(`listening on ${options.port}`);
    },
  };

  return app as IUnifiedApp;

}
