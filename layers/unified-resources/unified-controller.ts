import type { IUnifiedModel, IUnifiedController, IUnifiedControllerContext } from './interfaces.d.ts';
import { Document } from 'unified-kv';


export function createUnifiedController<T>(model: string, _schema: IUnifiedModel) {

  const document = new Document<T>(model);


  return {
    list: (context: IUnifiedControllerContext<T>) => {
      return document.list({
        filter: context.filter,
        limit: context.limit,
        skip: context.skip,
      });
    },
    retrieve: (context: IUnifiedControllerContext<T>) => {
      return document.retrieve({
        recordId: context.resourceId,
        filter: context.filter,
      });
    },
    find: async (context: IUnifiedControllerContext<T>) => {
      return document.find({
        recordId: context.resourceId,
        filter: context.filter,
      });
    },
    count: async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: context.limit,
        skip: context.skip,
      });

      return records.length;

    },
    exists: async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: 1,
      });

      return records.length > 0;

    },
    notExists:  async (context: IUnifiedControllerContext<T>) => {
      
      const records = await document.list({
        filter: context.filter,
        limit: 1,
      });

      return records.length === 0;

    },
    create: (context: IUnifiedControllerContext<T>) => {

      if (!context.document) {
        throw new Error('document is not provided');
      }

      return document.create(context.document);

    },
    update: (context: IUnifiedControllerContext<T>) => {

      if (!context.payload) {
        throw new Error('payload is not provided');
      }

      return document.update({
        recordId: context.resourceId,
        filter: context.filter,
        payload: context.payload,
      });

    },
    replace: (context: IUnifiedControllerContext<T>) => {

      if (!context.document) {
        throw new Error('document is not provided');
      }

      return document.replace({
        recordId: context.resourceId,
        filter: context.filter,
        payload: context.document,
      });

    },
    delete: (context: IUnifiedControllerContext<T>) => {
      return document.delete({
        recordId: context.resourceId,
        filter: context.filter,
      });
    },
  } as IUnifiedController<T>;

}
