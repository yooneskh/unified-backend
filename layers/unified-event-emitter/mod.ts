import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedApp {
    // deno-lint-ignore no-explicit-any
    listeners: { event: string; callback: (...args: any) => void; }[];
    // deno-lint-ignore no-explicit-any
    on: (event: string, callback: (...args: any) => void) => void;
    // deno-lint-ignore no-explicit-any
    emit: (event: string, ...args: any) => void;
  }
}


export function install(app: IUnifiedApp) {

  app.listeners = [];

  app.on = (event, callback) => {
    app.listeners!.push({
      event,
      callback,
    });
  };

  app.emit = (event, ...args) => {
    for (const listener of app.listeners!) {
      if (listener.event === event) {
        listener.callback(...args);
      }
    }
  };

}