import { ApplicationSettingMaker } from './resource.ts';
import './controller.ts';


ApplicationSettingMaker.addActions({
  'retrieve': {
    ...ApplicationSettingMaker.getRetrieveRoute(),
    permission: 'admin.application-setting.retrieve'
  },
  'update': {
    ...ApplicationSettingMaker.getUpdateRoute(),
    permission: 'admin.application-setting.update'
  }
});


export const ApplicationSettingRouter = ApplicationSettingMaker.getRouter();
