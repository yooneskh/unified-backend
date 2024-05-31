import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel } from './interfaces.d.ts';
import { registerPopulate } from 'unified-kv';
import { install as installUnifiedRouter } from './unified-router.ts';


export type {
  IUnifiedModel,
  IUnifiedModelBase,
  IUnifiedController,
  IUnifiedControllerContext,
} from './interfaces.d.ts';

export {
  createUnifiedController,
} from './unified-controller.ts';


function registerSchemaPopulates(model: string, schema: IUnifiedModel, keyPrefix = '') {
  for (const key in schema) {
    if (schema[key]?.ref) {
      registerPopulate(model, keyPrefix + key, schema[key]?.ref!);
    }
    else if (schema[key].type === 'series') {
      registerSchemaPopulates(model, schema[key].seriesSchema!, keyPrefix + key + '.')
    }
  }
}


export function install(app: IUnifiedApp) {

  app.models = {};

  app.addModel = (model, schema) => {
    app.models[model] = schema;
    registerSchemaPopulates(model, schema)
  };


  installUnifiedRouter(app);

}