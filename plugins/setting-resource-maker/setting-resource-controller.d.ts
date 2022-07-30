import { IResourceControllerPopulates } from '../resource-maker/resource-controller.d.ts';


export interface IResourceSettingsControllerContext<T, TF> {
  selects?: string[];
  populates?: IResourceControllerPopulates;
  payload?: Partial<T>;
}
