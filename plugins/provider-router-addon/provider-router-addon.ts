import { ResourceMaker } from '../resource-maker/resource-maker.ts';
import type { IResourceBase } from '../resource-maker/resource-model.d.ts';
import type { IResourceActionFunction, IResourceActionMultiFunction, IResourceVersioned } from '../resource-maker/resource-router.d.ts';
import { executeActionMultiFunction } from '../resource-maker/resource-util.ts';


declare module '../resource-maker/resource-router.d.ts' {

  interface IResourceAction<T, TF> {
    provider?: IResourceActionMultiFunction<T, TF> | IResourceVersioned<IResourceActionMultiFunction<T, TF>>;
    responsePreprocessors?: IResourceActionMultiFunction<T, TF>;
    postprocessors?: IResourceActionMultiFunction<T, TF>;
  }

  interface IResourceActionContext<T, TF> {
    // deno-lint-ignore no-explicit-any
    responseData?: any;
  }

}


ResourceMaker.addGlobalActionAugmentor(action => {

  if (!action.responsePreprocessors) {
    return {
      responsePreprocessors: []
    };
  }

  if (!action.postprocessors) {
    return {
      postprocessors: []
    };
  }

});


function transformSimpleProviderHandler<T, TF extends IResourceBase>(provider: IResourceActionMultiFunction<T, TF>): IResourceActionFunction<T, TF> {
  if (typeof provider === 'function') {
    return async (context) => {

      context.responseData = await provider(context);

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

      context.response.json(context.responseData);

      if (context.action.postprocessors) {
        await executeActionMultiFunction(context.action.postprocessors, context);
      }

    }
  }
  else if (Array.isArray(provider)) {
    return async (context) => {

      context.responseData = await Promise.all(provider.map(it => it(context)));

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

      context.response.json(context.responseData);

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

    }
  }
  else {
    return async (context) => {

      context.responseData = Object.fromEntries(
        await Promise.all(
          Object.entries(provider).map(async ([key, func]) =>
            [key, await func(context)]
          )
        )
      );

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

      context.response.json(context.responseData);

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

    }
  }
}


ResourceMaker.addGlobalActionAugmentor(({ handler, provider }) => {
  if (!provider || handler) return;

  const isDefinitelySimpleProvider = typeof provider === 'function' || Array.isArray(provider);
  const canBeBoth = !isDefinitelySimpleProvider && Object.values(provider).every(it => typeof it === 'function');

  const prefersVersionedProviders = true; // false for labeled providers

  if (isDefinitelySimpleProvider || (canBeBoth && !prefersVersionedProviders)) {
    return {
      handler: transformSimpleProviderHandler(provider as IResourceActionMultiFunction<unknown, IResourceBase>)
    };
  }
  else {
    return {
      handler: Object.fromEntries(
        Object.entries(provider as IResourceVersioned<IResourceActionMultiFunction<unknown, IResourceBase>>).map(([version, providerEntry]) =>
          [
            version,
            transformSimpleProviderHandler(providerEntry)
          ]
        )
      )
    }
  }

});
