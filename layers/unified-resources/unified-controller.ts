import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController, IUnifiedControllerContext } from './interfaces.d.ts';
import { Document } from 'unified-kv';


export function createUnifiedController<T>(app: IUnifiedApp, model: string, _schema: IUnifiedModel<unknown>) {

  const document = new Document<T>(model);


  return {
    list: async (context: IUnifiedControllerContext<T>) => {

      const records = await document.list({
        filter: context.filter,
        populate: context.populate,
        select: context.select,
        limit: context.limit,
        skip: context.skip,
      });

      app.emit(`${model}.list`, records);

      return records;

    },
    retrieve: async (context: IUnifiedControllerContext<T>) => {

      const record = await document.retrieve({
        recordId: context.resourceId,
        filter: context.filter,
        populate: context.populate,
        select: context.select,
      });

      app.emit(`${model}.retrieve`, record);

      return record;

    },
    find: async (context: IUnifiedControllerContext<T>) => {

      const record = await document.find({
        recordId: context.resourceId,
        filter: context.filter,
        populate: context.populate,
        select: context.select,
      });

      app.emit(`${model}.find`, record);

      return record;

    },
    count: async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: context.limit,
        skip: context.skip,
      });

      app.emit(`${model}.count`, records.length);

      return records.length;

    },
    exists: async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: 1,
      });

      app.emit(`${model}.exists`, records.length > 0);

      return records.length > 0;

    },
    notExists:  async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: 1,
      });

      app.emit(`${model}.not-exists`, records.length === 0);

      return records.length === 0;

    },
    create: async (context: IUnifiedControllerContext<T>) => {

      if (!context.document) {
        throw new Error('document is not provided');
      }

      const record = await document.create(context.document);

      app.emit(`${model}.create`, record);

      return record;

    },
    update: async (context: IUnifiedControllerContext<T>) => {

      if (!context.payload) {
        throw new Error('payload is not provided');
      }

      const previousRecord = await document.find({
        recordId: context.resourceId,
        filter: context.filter,
      });

      const newRecord = await document.update({
        recordId: context.resourceId,
        filter: context.filter,
        payload: context.payload,
      });

      app.emit(`${model}.update`, newRecord, previousRecord);

      return newRecord;

    },
    replace: async (context: IUnifiedControllerContext<T>) => {

      if (!context.document) {
        throw new Error('document is not provided');
      }

      const previousRecord = await document.find({
        recordId: context.resourceId,
        filter: context.filter,
      });

      const newRecord = await document.replace({
        recordId: context.resourceId,
        filter: context.filter,
        payload: context.document,
      });

      app.emit(`${model}.replace`, newRecord, previousRecord);

      return newRecord;

    },
    delete: async (context: IUnifiedControllerContext<T>) => {

      const record = await document.delete({
        recordId: context.resourceId,
        filter: context.filter,
      });

      app.emit(`${model}.delete`, record);

      return record;

    },
  } as IUnifiedController<T>;

}
