import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedActionContext {
    timeStart?: number;
    timeEnd?: number;
  }
}


export function install(app: IUnifiedApp) {

  app.addMiddlewares({
    'set-start': context => {
      context.timeStart = Date.now();
    },
  });

  app.addPostwares({
    'print-log': context => {
      context.timeEnd = Date.now();
      console.log(`${context.action.method?.toLowerCase()} ${context.action.path} - ${context.timeEnd! - context.timeStart!}ms`);
    },
  });

}