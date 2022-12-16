import type { IResourceBase } from '../../plugins/resource-maker/model.d.ts';


export interface IApplicationSettingsBase {
  name: string;
} export interface IApplicationSettings extends IApplicationSettingsBase, IResourceBase {}
