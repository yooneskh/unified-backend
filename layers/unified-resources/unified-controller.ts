import type { IUnifiedModel, IUnifiedController } from './interfaces.d.ts';
import { Document } from 'unified-kv';


export function createUnifiedController<T>(model: string, schema: IUnifiedModel) {

  const document = new Document<T>(model);


  return {
    list: () => {
      return document.list();
    },
    retrieve: () => {
      return document.retrieve('xxx');
    },
    find: async () => {
      return (await document.list())?.[0];
    },
    count: async () => {
      return (await document.list()).length;
    },
    exists: async () => {
      return (await document.list())?.[0] !== undefined;
    },
    notExists:  async () => {
      return (await document.list())?.[0] === undefined;
    },
    create: () => {
      return document.create({} as T);
    },
    update: () => {
      return document.update('xxx', {});
    },
    replace: () => {
      throw new Error('not implemented');
    },
    delete: () => {
      return document.delete('xxx') as T;
    },
  } as IUnifiedController<T>;

}
