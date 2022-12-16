import { UnifiedRouter } from '../../deps.ts';
import { AugmentLooper, Augmentor } from '../augment-looper/augment-looper.ts';
import { ResourceController } from './controller.ts';
import type { IResourceBase } from './model.d.ts';
import type { IResourceAction, IResourceActionContext, IResourceWare } from './router.d.ts';


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

    const router = new UnifiedRouter();

    for (const action of this.actions) {

      this.actionAugmentLooper.augment(action);

      if (!action.signal) throw new Error('action does not have signal');
      if (!action.method) throw new Error('action does not have method');
      if (!action.path) throw new Error('action does not have path');
      if (!action.handler) throw new Error('action does not have handler');

      router.route({
        method: action.method,
        path: action.path,
        handler: async (request, requestContext) => {

          const baseContext: Partial<IResourceActionContext<T, TF>> = {
            action,
            request: request,
            controller: this.controller!,
            version: requestContext.headers['version'],
            payload: requestContext.body ?? {},
            params: requestContext.params,
            queries: requestContext.queries,
            headers: requestContext.headers,
          };

          const context: IResourceActionContext<T, TF> = baseContext as unknown as IResourceActionContext<T, TF>;


          for (const ware of this.prewares) {
            await ware(context);
          }


          let response;

          if (context.version) {
            if (typeof action.handler === 'function') {
              if (context.version === '1') {
                response = await action.handler(context);
              }
              else {
                throw new Error(`this version '${context.version}' of the action is not implemented`);
              }
            }
            else if (action.handler![context.version]) {
              response = await action.handler![context.version](context);
            }
            else {
              throw new Error(`this version '${context.version}' of the action is not implemented`);
            }
          }
          else {
            if (typeof action.handler! === 'function') {
              response = await action.handler(context);
            }
            else if (action.handler!['1']) {
              response = await action.handler!['1'](context);
            }
            else {
              throw new Error('this action does not have a default version. please specify the version header.');
            }
          }

          return response;

        }
      });

    }

    return router;

  }

}
