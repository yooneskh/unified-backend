import { IUnifiedApp } from 'unified-app';
import './interfaces.d.ts';


export type {
  IUnifiedModel,
  IUnifiedModelBase,
  IUnifiedController,
} from './interfaces.d.ts';

export {
  createUnifiedController,
} from './unified-controller.ts';


export function install(app: IUnifiedApp) {

  app.models = {};

  app.addModel = (model, schema) => {
    app.models[model] = schema;
  };

  console.log('installed unified resources layer');

}