import { IUnifiedApp } from 'unified-app';
import { install as installUnifiedRouter } from './unified-router.ts';
import './interfaces.d.ts';


export type {
  IUnifiedModel,
  IUnifiedModelBase,
  IUnifiedController,
  IUnifiedControllerContext,
} from './interfaces.d.ts';

export {
  createUnifiedController,
} from './unified-controller.ts';


export function install(app: IUnifiedApp) {

  app.models = {};

  app.addModel = (model, schema) => {
    app.models[model] = schema;
  };


  installUnifiedRouter(app);

}