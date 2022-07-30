// deno-lint-ignore-file no-explicit-any

import { ObjectId } from '../../deps.ts';


export interface IResourceControllerPopulates {
  [keyPath: string]: string
}

export interface IResourceControllerContext<T, TF> {
  filters?: any;
  selects?: string[];
  skip?: number;
  limit?: number;
  sorts?: any;
  populates?: IResourceControllerPopulates;
  resourceId?: string | ObjectId;
  document?: T;
  payload?: Partial<T>;
}
