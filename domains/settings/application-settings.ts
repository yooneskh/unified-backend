import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedSettingController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedSettingController } from 'unified-resources';


interface IApplicationSettingBase {
  name?: string;
} export interface IApplicationSetting extends IApplicationSettingBase, IBaseDocument {}

const ApplicationSettingSchema: IUnifiedModel<IApplicationSettingBase> = {
  name: {
    type: 'string',
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    applicationSettings: IUnifiedSettingController<IApplicationSettingBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('ApplicationSetting', ApplicationSettingSchema);

  app.applicationSettings = createUnifiedSettingController<IApplicationSettingBase>(app, 'ApplicationSetting', ApplicationSettingSchema);


  app.addActions({
    'retrieve': {
      method: 'get',
      path: '/application-settings/',
      handler: ({ filter, populate, select }) => {
        return app.applicationSettings.retrieve({
          filter,
          populate,
          select,
        });
      },
    },
    'update': {
      method: 'patch',
      path: '/application-settings/',
      requirePermission: 'admin.settings.application-settings.update',
      handler: ({ filter, body }) => {
        return app.applicationSettings.update({
          filter,
          payload: body,
        });
      },
    },
  });

}
