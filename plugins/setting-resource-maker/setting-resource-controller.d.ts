import { IResourceControllerPopulates } from '../resource-maker/controller.d.ts';


export interface IResourceSettingsControllerContext<T, TF> {
  selects?: string[];
  populates?: IResourceControllerPopulates;
  payload?: Partial<T>;
}
