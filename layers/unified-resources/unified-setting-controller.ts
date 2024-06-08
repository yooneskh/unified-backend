import type { IUnifiedModel, IUnifiedSettingController, IUnifiedSettingControllerContext } from './interfaces.d.ts';
import { Document } from 'unified-kv';


export function createUnifiedSettingController<T>(model: string, _schema: IUnifiedModel<unknown>) {

  const document = new Document<T>(model);


  return {
    retrieve: async (context: IUnifiedSettingControllerContext<T>) => {

      const item = await document.find({
        recordId: context.resourceId,
        filter: context.filter || {},
        populate: context.populate,
        select: context.select,
      });


      if (!item) {
        // deno-lint-ignore no-explicit-any
        return document.create({} as any)
      }

      return item;

    },
    update: async (context: IUnifiedSettingControllerContext<T>) => {

      if (!context.payload) {
        throw new Error('payload is not provided');
      }


      let itemId;

      const item = await document.find({
        recordId: context.resourceId,
        filter: context.filter || {},
        populate: context.populate,
        select: context.select,
      });

      if (item) {
        itemId = item._id;
      }
      else {
        // deno-lint-ignore no-explicit-any
        itemId = (await document.create({} as any))._id;
      }


      return document.update({
        recordId: itemId,
        payload: context.payload,
      });

    },
  } as IUnifiedSettingController<T>;

}
