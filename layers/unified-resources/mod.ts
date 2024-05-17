import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedApp {
    models: Record<string, unknown>;
    addModel: (model: string, schema: unknown) => void;
  }
}

export function install(app: IUnifiedApp) {

  app.models = {};

  app.addModel = (model, schema) => {
    app.models[model] = schema;
  };

  console.log('installed unified resources layer');

}