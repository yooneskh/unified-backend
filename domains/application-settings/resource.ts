import { SettingResourceMaker } from '../../plugins/setting-resource-maker/setting-resource-maker.ts';
import type { IApplicationSettingsBase, IApplicationSettings } from './interfaces.d.ts';


export const ApplicationSettingMaker = new SettingResourceMaker<IApplicationSettingsBase, IApplicationSettings>('ApplicationSetting');
