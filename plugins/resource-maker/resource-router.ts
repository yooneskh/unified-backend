import { Router } from '../../deps.ts';
import { AugmentLooper, Augmentor } from '../augment-looper/augment-looper.ts';
import { ResourceController } from './resource-controller.ts';
import type { IResourceBase } from './resource-model.d.ts';
import type { IResourceAction, IResourceActionContext, IResourceWare } from './resource-router.d.ts';


export class ResourceRouter<T, TF extends IResourceBase> {

  private actions: IResourceAction<T, TF>[] = [];

  private prewares: IResourceWare<T, TF>[] = [];
  private postwares: IResourceWare<T, TF>[] = [];
  private actionAugmentLooper = new AugmentLooper< IResourceAction<T, TF> >();


  constructor(public name: string, public controller?: ResourceController<T, TF>) {

  }


  public addAction(action: IResourceAction<T, TF>) {
    action.resourceName = this.name;
    this.actions.push(action);
  }

  public addActions(actions: IResourceAction<T, TF>[]) {
    for (const action of actions) {
      this.addAction(action);
    }
  }

  public addPreware(ware: IResourceWare<T, TF>) {
    this.prewares.push(ware);
  }

  public addPostware(ware: IResourceWare<T, TF>) {
    this.postwares.push(ware);
  }

  public addActionAugmenter(augmenter: Augmentor< IResourceAction<T, TF> >) {
    this.actionAugmentLooper.addAugmentor(augmenter);
  }


  public getRouter() {

    const router = new Router();

    for (const action of this.actions) {

      this.actionAugmentLooper.augment(action);

      if (!action.signal) throw new Error('action does not have signal');
      if (!action.method) throw new Error('action does not have method');
      if (!action.path) throw new Error('action does not have path');
      if (!action.handler) throw new Error('action does not have handler');

      router[action.method](action.path, async rev => {

        const baseContext: Partial<IResourceActionContext<T, TF>> = {
          action,
          requestEvent: rev,
          request: rev.request,
          response: rev.response,
          controller: this.controller!,
          version: rev.request.headers.get('version') ?? undefined,
          payload: rev.body || {},
          params: rev.params,
          query: rev.query,
          headers: Object.fromEntries([...rev.request.headers.entries()]),
          setHeader: (header, value) => rev.response.header(header, value)
        };

        const context: IResourceActionContext<T, TF> = baseContext as unknown as IResourceActionContext<T, TF>;

        for (const ware of this.prewares) {
          await ware(context);
        }

        if (context.version) {
          if (typeof action.handler === 'function') {
            if (context.version === '1') {
              await action.handler(context);
            }
            else {
              throw new Error(`this version '${context.version}' of the action is not implemented`);
            }
          }
          else if (action.handler![context.version]) {
            await action.handler![context.version](context);
          }
          else {
            throw new Error(`this version '${context.version}' of the action is not implemented`);
          }
        }
        else {
          if (typeof action.handler! === 'function') {
            await action.handler(context);
          }
          else if (action.handler!['1']) {
            await action.handler!['1'](context);
          }
          else {
            throw new Error('this action does not have a default version. please specify the version header.');
          }
        }

        await Promise.all(
          this.postwares.map(ware =>
            ware(context)
          )
        );

      });

    }

    return router;

  }

}
