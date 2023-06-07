// deno-lint-ignore no-unused-vars
import type { IResourceActionContext } from 'resource-maker';
import { SettingResourceController } from './setting-resource-controller.ts';


declare module 'resource-maker' {
  interface IResourceActionContext<T, TF> {
    settingController: SettingResourceController<T, TF>
  }
}
