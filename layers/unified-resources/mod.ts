import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel } from './interfaces.d.ts';
import { registerPopulate } from 'unified-kv';
import { install as installUnifiedRouter } from './unified-router.ts';


export type {
  IUnifiedModel,
  IUnifiedModelBase,
  IUnifiedController,
  IUnifiedControllerContext,
  IUnifiedSettingController,
  IUnifiedSettingControllerContext,
} from './interfaces.d.ts';

export {
  createUnifiedController,
} from './unified-controller.ts';

export {
  createUnifiedSettingController,
} from './unified-setting-controller.ts';


function registerSchemaPopulates(model: string, schema: IUnifiedModel<unknown>, keyPrefix = '') {
  for (const key in schema) {
    // deno-lint-ignore no-explicit-any
    if ((schema as any)[key]?.ref) {
      // deno-lint-ignore no-explicit-any
      registerPopulate(model, keyPrefix + key, (schema as any)[key]?.ref!);
    }
    // deno-lint-ignore no-explicit-any
    else if ((schema as any)[key].type === 'series') {
      // deno-lint-ignore no-explicit-any
      registerSchemaPopulates(model, (schema as any)[key].seriesSchema!, keyPrefix + key + '.')
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