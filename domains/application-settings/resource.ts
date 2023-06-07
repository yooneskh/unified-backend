import { SettingResourceMaker } from 'setting-resource-maker';
import type { IApplicationSettingsBase, IApplicationSettings } from './interfaces.d.ts';


export const ApplicationSettingMaker = new SettingResourceMaker<IApplicationSettingsBase, IApplicationSettings>('ApplicationSetting');
