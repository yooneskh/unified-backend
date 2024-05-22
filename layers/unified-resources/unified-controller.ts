import type { IUnifiedModel, IUnifiedController } from './interfaces.d.ts';


export function createUnifiedController<T>(model: string, schema: IUnifiedModel) {


  return {
    list: () => {

    },
    retrieve: () => {

    },
    find: () => {

    },
    count: () => {

    },
    exists: () => {

    },
    notExists: () => {

    },
    create: () => {

    },
    update: () => {

    },
    replace: () => {

    },
    delete: () => {

    },
  } as IUnifiedController<T>;

}
