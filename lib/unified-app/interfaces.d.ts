

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
  // deno-lint-ignore no-explicit-any
  listeners: { event: string; callback: (...args: any) => void; }[];
  pathPush: (segment: string) => void;
  pathPop: () => string | undefined;
  addAction: (route: IUnifiedAction) => void;
  addMiddleware: (middleware: IUnifiedMiddleware) => void;
  addPostware: (postware: IUnifiedMiddleware) => void;
  addActionProcessor: (processor: IUnifiedProcessor) => void;
  // deno-lint-ignore no-explicit-any
  on: (event: string, callback: (...args: any) => void) => void;
  // deno-lint-ignore no-explicit-any
  emit: (event: string, ...args: any) => void;
  listen: (options: IUnifiedAppListen) => Deno.HttpServer;
}
