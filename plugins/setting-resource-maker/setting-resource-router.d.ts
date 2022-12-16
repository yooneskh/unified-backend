// deno-lint-ignore no-unused-vars
import type { IResourceActionContext } from '../resource-maker/router.d.ts';
import { SettingResourceController } from './setting-resource-controller.ts';


declare module '../resource-maker/router.d.ts' {
  interface IResourceActionContext<T, TF> {
    settingController: SettingResourceController<T, TF>
  }
}
