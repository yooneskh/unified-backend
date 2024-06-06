import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedActionContext {
    timeStart?: number;
    timeEnd?: number;
  }
}


export function install(app: IUnifiedApp) {

  app.addMiddleware(context => {
    context.timeStart = Date.now();
  });

  app.addPostware(context => {
    context.timeEnd = Date.now();
    console.log(`${context.action.method?.toUpperCase()} ${context.action.path} - ${context.timeEnd! - context.timeStart!}ms`);
  });

}