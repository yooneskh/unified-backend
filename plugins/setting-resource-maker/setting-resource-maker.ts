import { ResourceMaker } from '../resource-maker/maker.ts';
import { IResourceBase, IResourceProperties } from '../resource-maker/model.d.ts';
import { IResourceAction } from '../resource-maker/router.d.ts';
import { IResourceValidation } from '../resource-maker/validator.ts';
import { SettingResourceController } from './setting-resource-controller.ts';
import type {} from './setting-resource-router.d.ts';


export class SettingResourceMaker<T, TF extends IResourceBase> {

  constructor (private name: string) {
    this.resourceMaker = new ResourceMaker(name);
  }

  private resourceMaker: ResourceMaker<T, TF>;
  private controller?: SettingResourceController<T, TF>;


  public setProperties(properties: IResourceProperties<T, TF>) {
    if (this.controller) {
      throw new Error(`${this.name} controller is already made`);
    }

    this.resourceMaker.setProperties(properties);
    this.resourceMaker.makeModel();

  }

  public makeModel() {
    this.resourceMaker.makeModel();
  }


  public getController() {
    return this.controller = new SettingResourceController<T, TF>(this.resourceMaker.getController())
  }

  public addValidations(validations: IResourceValidation<T, TF>) {
    this.resourceMaker.addValidations(validations);
  }


  public getRetrieveRoute(): IResourceAction<T, TF> {
    return {
      method: 'get',
      path: '/',
      signal: `Route.${this.name}.Retrieve`,
      provider: ({ settingController, selects, populates }) => settingController.retrieve({ selects, populates })
    };
  }

  public getUpdateRoute(): IResourceAction<T, TF> {
    return {
      method: 'patch',
      path: '/',
      signal: `Route.${this.name}.Update`,
      provider: ({ settingController, payload }) => settingController.update({ payload })
    };
  }

  public addAction(action: IResourceAction<T, TF>) {
    this.resourceMaker.addAction(action);
  }

  public addActions(actions: IResourceAction<T, TF>[] | Record<string, IResourceAction<T, TF>>) {
    this.resourceMaker.addActions(actions);
  }

  public getRouter() {

    this.resourceMaker.addPreware(context => {
      context.settingController = this.controller!;
    });

    return this.resourceMaker.getRouter();

  }

}
