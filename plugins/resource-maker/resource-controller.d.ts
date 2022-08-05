// deno-lint-ignore-file no-explicit-any

import { ObjectId } from '../../deps.ts';
import { Filter } from './mongo_types.ts';


export interface IResourceControllerPopulates {
  [keyPath: string]: string
}

export interface IResourceControllerContext<T, TF> {
  filters?: Filter<T>;
  selects?: string[];
  skip?: number;
  limit?: number;
  sorts?: any;
  populates?: IResourceControllerPopulates;
  resourceId?: string | ObjectId;
  document?: T;
  payload?: Partial<T>;
}
