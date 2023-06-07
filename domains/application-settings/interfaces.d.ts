import type { IResourceBase } from 'resource-maker';


export interface IApplicationSettingsBase {
  name: string;
} export interface IApplicationSettings extends IApplicationSettingsBase, IResourceBase {}
