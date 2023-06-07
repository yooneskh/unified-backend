import { IResourceControllerPopulates } from 'resource-maker';


export interface IResourceSettingsControllerContext<T, TF> {
  selects?: string[];
  populates?: IResourceControllerPopulates;
  payload?: Partial<T>;
}
