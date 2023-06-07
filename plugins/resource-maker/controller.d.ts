import { ObjectId } from 'yongo';
import { Filter } from './mongo_types.ts';


export interface IResourceControllerPopulates {
  [keyPath: string]: string
}

export interface IResourceControllerContext<T, TF> {
  filters?: Filter<TF>;
  selects?: string[];
  skip?: number;
  limit?: number;
  // deno-lint-ignore no-explicit-any
  sorts?: any;
  populates?: IResourceControllerPopulates;
  resourceId?: string | ObjectId;
  document?: T;
  payload?: Partial<T>;
}
