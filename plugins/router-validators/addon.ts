import { ResourceMaker } from 'resource-maker';
import type { IResourceActionMultiFunction } from 'resource-maker';
import { executeActionMultiFunction } from 'resource-maker';


declare module 'resource-maker' {
  interface IResourceAction<T, TF> {
    stateValidators?: IResourceActionMultiFunction<T, TF>;
    payloadValidators?: IResourceActionMultiFunction<T, TF>;
    payloadProcessor?: IResourceActionMultiFunction<T, TF>;
  }
}


ResourceMaker.addGlobalActionAugmentor(action => {

  if (!action.stateValidators) {
    return {
      stateValidators: []
    };
  }

  if (!action.payloadValidators) {
    return {
      payloadValidators: []
    };
  }

  if (!action.payloadProcessor) {
    return {
      payloadProcessor: []
    };
  }

});


ResourceMaker.addGlobalPreware(async context => {

  if (context.action.payloadValidators) {
    await executeActionMultiFunction(context.action.payloadValidators, context);
  }

  if (context.action.stateValidators) {
    await executeActionMultiFunction(context.action.stateValidators, context);
  }

  if (context.action.payloadProcessor) {
    await executeActionMultiFunction(context.action.payloadProcessor, context);
  }

});
