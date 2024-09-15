

export interface IUnifiedActionContext {
  app: IUnifiedApp;
  action: IUnifiedAction;
  request: Request;
  requestInfo: Deno.ServeHandlerInfo;
  params: Record<string, string | undefined>;
  headers: Record<string, string>;
  query: Record<string, string>;
  // deno-lint-ignore no-explicit-any
  body: any;
  response?: unknown;
}

export interface IUnifiedAction {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path?: string;
  handler?: (context: IUnifiedActionContext) => Promise<unknown> | unknown;
}

export type IUnifiedMiddleware = (context: IUnifiedActionContext) => void | Promise<void>;

export type IUnifiedProcessor = (action: IUnifiedAction) => void;

export interface IUnifiedAppListen {
  port: number;
}


export interface IUnifiedApp {
  pathStack: string[];
  actions: IUnifiedAction[];
  middlewares: IUnifiedMiddleware[];
  postwares: IUnifiedMiddleware[];
  actionProcessors: IUnifiedProcessor[];
  pathPush: (segment: string) => void;
  pathPop: () => string | undefined;
  addActions: (routes: Record<string, IUnifiedAction>) => void;
  addMiddlewares: (middlewares: Record<string, IUnifiedMiddleware>) => void;
  addPostwares: (postwares: Record<string, IUnifiedMiddleware>) => void;
  addActionProcessors: (processors: Record<string, IUnifiedProcessor>) => void;
  listen: (options: IUnifiedAppListen) => Deno.HttpServer;
}
