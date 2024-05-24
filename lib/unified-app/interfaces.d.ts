

export interface IUnifiedActionContext {
  app: IUnifiedApp;
  action: IUnifiedAction;
  request: Request;
  params: Record<string, string | undefined>;
  headers: Record<string, string>;
  query: Record<string, string>;
  // deno-lint-ignore no-explicit-any
  body: any;
  response?: unknown;
}

export interface IUnifiedAction {
  method?: string;
  path?: string;
  handler?: (context: IUnifiedActionContext) => Promise<unknown> | unknown;
}

export type IUnifiedMiddleware = (context: IUnifiedActionContext) => void;

export interface IUnifiedAppListen {
  port: number;
}


export interface IUnifiedApp {
  actions: IUnifiedAction[];
  middlewares: IUnifiedMiddleware[];
  addAction: (route: IUnifiedAction) => void;
  addMiddleware: (middleware: IUnifiedMiddleware) => void;
  listen: (options: IUnifiedAppListen) => void;
}
