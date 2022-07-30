import { ApplicationSettingMaker } from './resource.ts';
import './model.ts';


export const ApplicationSettingController = ApplicationSettingMaker.getController();


ApplicationSettingMaker.addValidations({
  name: [
    it => it.name === 'Application' || 'name must be Application'
  ]
});
