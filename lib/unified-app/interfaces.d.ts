

export interface IUnifiedActionContext {
  app: IUnifiedApp;
  action: IUnifiedAction;
  response?: unknown;
}

export interface IUnifiedAction {
  method: string;
  path: string;
  handler: (context: IUnifiedActionContext) => Promise<unknown> | unknown;
}

export interface IUnifiedAppListen {
  port: number;
}

export interface IUnifiedApp {
  actions: IUnifiedAction[];
  addAction: (route: IUnifiedAction) => void;
  listen: (options: IUnifiedAppListen) => void;
}
