

interface IUnifiedRoute {
  method: string;
  path: string;
  handler: (context: unknown) => void;
}

interface IUnifiedAppListen {
  port: number;
};

export interface IUnifiedApp {
  routes: IUnifiedRoute[];
  addRoute: (route: IUnifiedRoute) => void;
  listen: (options: IUnifiedAppListen) => void;
};


export function createUnifiedApp(): IUnifiedApp {

  const app: Partial<IUnifiedApp> = {
    routes: [],
    addRoute: (route: IUnifiedRoute) => {
      app.routes!.push(route);
    },
    listen: (options: IUnifiedAppListen) => {
      console.log(`listening on ${options.port}`);
    },
  };

  return app as IUnifiedApp;

}
