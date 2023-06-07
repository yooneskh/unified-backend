// deno-lint-ignore-file no-explicit-any
import { registerPopulateItem } from 'yongo';
import { Augmentor } from '../augment-looper/augment-looper.ts';
import { ResourceController } from './controller.ts';
import type { IResourceBase, IResourceProperties } from './model.d.ts';
import type { IResourceAction, IResourceWare } from './router.d.ts';
import { ResourceRouter } from './router.ts';
import { IResourceValidation, ResourceValidator } from './validator.ts';


export class ResourceMaker<T, TF extends IResourceBase> {

  constructor(public name: string) {

  }


  public properties?: IResourceProperties<T, TF>;

  public setProperties(properties: IResourceProperties<T, TF>) {
    this.properties = properties;
  }

  public makeModel() {
    if (!this.properties) {
      throw new Error(`${this.name} properties is not set`);
    }

    this.registerPropertiesPopulates(this.properties);

  }

  private registerPropertiesPopulates(properties: IResourceProperties<any, IResourceBase>, keyPath: string[] = []) {
    for (const key in properties) {

      if (properties[key].ref) {
        registerPopulateItem({
          model: this.name,
          key: [...keyPath, key].join('.'),
          ref: properties[key].ref!
        });
      }

      if (properties[key].type === 'series') {
        this.registerPropertiesPopulates(properties[key].seriesSchema!, [...keyPath, key]);
      }

    }
  }


  private controller?: ResourceController<T, TF>;
  private validator?: ResourceValidator<T, TF>;

  public getController(): ResourceController<T, TF> {
    if (this.controller) {
      throw new Error(`${this.name} controller has been already made`);
    }

    if (!this.properties) {
      throw new Error(`${this.name} properties are not set`)
    }

    this.validator = new ResourceValidator<T, TF>(this.name, this.properties);
    this.controller = new ResourceController<T, TF>(this.name, this.properties, this.validator);

    this.validator.setController(this.controller);
    return this.controller;

  }

  public addValidations(validations: IResourceValidation<T, TF>) {
    if (!this.validator) {
      throw new Error(`${this.name} contoller has not been made to make validator`);
    }

    this.validator.addValidations(validations);

  }


  private static globalPrewares: IResourceWare<any, any>[] = [];
  private static globalPostwares: IResourceWare<any, any>[] = [];
  private static globalActionAugmentors: Augmentor< IResourceAction<any, any> >[] = [];

  public static addGlobalPreware<T, TF extends IResourceBase>(ware: IResourceWare<T, TF>) {
    this.globalPrewares.push(ware as unknown as any);
  }

  public static addGlobalPostware<T, TF extends IResourceBase>(ware: IResourceWare<T, TF>) {
    this.globalPostwares.push(ware as unknown as any);
  }

  public static addGlobalActionAugmentor<T, TF extends IResourceBase>(augmentor: Augmentor< IResourceAction<T, TF> >) {
    this.globalActionAugmentors.push(augmentor as unknown as any);
  }


  private prewares: IResourceWare<T, TF>[] = [];
  private postwares: IResourceWare<T, TF>[] = [];
  private actionAugmentors: Augmentor< IResourceAction<T, TF> >[] = [];

  public addPreware(ware: IResourceWare<T, TF>) {
    this.prewares.push(ware);
  }

  public addPostware(ware: IResourceWare<T, TF>) {
    this.postwares.push(ware);
  }

  public addActionAugmentor(augmentor: Augmentor< IResourceAction<T, TF> >) {
    this.actionAugmentors.push(augmentor);
  }

  private router?: ResourceRouter<T, TF>;
  public actions: IResourceAction<T, TF>[] = [];

  public addAction(action: IResourceAction<T, TF>) {
    this.actions.push(action);
  }

  public addActions(actions: IResourceAction<T, TF>[] | Record<string, IResourceAction<T, TF>>) {

    if (Array.isArray(actions)) {
      for (const action of actions) {
        this.actions.push(action);
      }
    }
    else {
      for (const label in actions) {
        this.actions.push({ label, ...actions[label] });
      }
    }

  }

  public getRouter() {
    if (this.router) {
      throw new Error(`${this.name} router is already made`);
    }

    this.router = new ResourceRouter<T, TF>(this.name, this.controller);


    for (const ware of ResourceMaker.globalPrewares) this.router.addPreware(ware as any);
    for (const ware of ResourceMaker.globalPostwares) this.router.addPostware(ware as any);
    for (const augmentor of ResourceMaker.globalActionAugmentors) this.router.addActionAugmenter(augmentor as any);

    for (const ware of this.prewares) this.router.addPreware(ware);
    for (const ware of this.postwares) this.router.addPostware(ware);
    for (const augmentor of this.actionAugmentors) this.router.addActionAugmenter(augmentor);


    const metaObject = Object.keys(this.properties ?? {}).map(key => ({ key, ...this.properties![key as keyof T] }));

    this.router.addAction({
      method: 'get',
      path: '/meta',
      signal: `Route.${this.name}.Meta`,
      provider: () => {
        return metaObject;
      }
    });


    this.router.addAction({
      method: 'get',
      path: '/validate',
      signal: `Route.${this.name}.HasValidate`,
      provider: () => {
        return !!this.validator;
      }
    });

    this.router.addAction({
      method: 'post',
      path: '/validate',
      signal: `Route.${this.name}.Validate`,
      provider: async ({ payload }) => {
        if (!this.validator) {
          throw new Error(`no validator registered for ${this.name}`);
        }

        await this.validator.validate(payload);
        return true;

      }
    });


    this.router.addActions(this.actions);
    return this.router.getRouter();

  }

}
