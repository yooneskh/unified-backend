import { ResourceMaker } from '../resource-maker/maker.ts';
import type { IResourceBase } from '../resource-maker/model.d.ts';
import type { IResourceActionFunction, IResourceActionMultiFunction, IResourceVersioned, IRouteHandlerReturn } from '../resource-maker/router.d.ts';
import { executeActionMultiFunction } from '../resource-maker/utilities.ts';


declare module '../resource-maker/router.d.ts' {

  interface IResourceAction<T, TF> {
    provider?: IResourceActionMultiFunction<T, TF> | IResourceVersioned<IResourceActionMultiFunction<T, TF>>;
    responsePreprocessors?: IResourceActionMultiFunction<T, TF>;
  }

  interface IResourceActionContext<T, TF> {
    responseData?: IRouteHandlerReturn;
  }

}


ResourceMaker.addGlobalActionAugmentor(action => {
  if (!action.responsePreprocessors) {
    return {
      responsePreprocessors: []
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

      return context.responseData;

    }
  }
  else if (Array.isArray(provider)) {
    return async (context) => {

      context.responseData = await Promise.all(provider.map(it => it(context)));

      if (context.action.responsePreprocessors) {
        await executeActionMultiFunction(context.action.responsePreprocessors, context);
      }

      return context.responseData;

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


      return context.responseData;

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
