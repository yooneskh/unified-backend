import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedSettingController, IUnifiedSettingControllerContext } from './interfaces.d.ts';
import { Document } from 'unified-kv';
import { dash } from 'radash';


export function createUnifiedSettingController<T>(app: IUnifiedApp, model: string, _schema: IUnifiedModel<unknown>) {

  const document = new Document<T>(model);
  const modelDashed = dash(model);


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
        const record = await document.create({} as any);

        app.emit(`${modelDashed}.retrieve`, record);
        return record;

      }


      app.emit(`${modelDashed}.retrieve`, item);
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


      const previousRecord = await document.find({
        recordId: itemId,
      });

      const newRecord = await document.update({
        recordId: itemId,
        payload: context.payload,
      });


      app.emit(`${modelDashed}.update`, newRecord, previousRecord);
      return newRecord;

    },
  } as IUnifiedSettingController<T>;

}
