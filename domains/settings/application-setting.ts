import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedSettingController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedSettingController } from 'unified-resources';


interface IApplicationSettingBase {
  name: string;
} export interface IApplicationSetting extends IApplicationSettingBase, IBaseDocument {}

const ApplicationSettingSchema: IUnifiedModel<IApplicationSettingBase> = {
  name: {
    type: 'string',
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    applicationSetting: IUnifiedSettingController<IApplicationSettingBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('ApplicationSetting', ApplicationSettingSchema);

  app.applicationSetting = createUnifiedSettingController(app, 'ApplicationSetting', ApplicationSettingSchema);


  app.addActions({
    'retrieve': {
      method: 'get',
      path: '/application-settings/',
      handler: ({ filter, populate, select }) => {
        return app.applicationSetting.retrieve({
          filter,
          populate,
          select,
        });
      },
    },
    'update': {
      method: 'patch',
      path: '/application-settings/',
      requirePermission: 'admin.settings.application-settings.retrieve',
      handler: ({ filter, body }) => {
        return app.applicationSetting.update({
          filter,
          payload: body,
        });
      },
    },
  });

}
