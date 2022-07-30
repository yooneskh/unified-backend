// deno-lint-ignore no-unused-vars
import type { IResourceActionContext } from '../resource-maker/resource-router.d.ts';
import { SettingResourceController } from './setting-resource-controller.ts';


declare module '../resource-maker/resource-router.d.ts' {
  interface IResourceActionContext<T, TF> {
    settingController: SettingResourceController<T, TF>
  }
}
