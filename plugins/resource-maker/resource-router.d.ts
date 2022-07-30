import { HttpResponse, RequestEvent } from '../../deps.ts';
import { ResourceController } from './resource-controller.ts';
import type { IResourceBase } from './resource-model.d.ts';


export interface IResourceAction<T, TF extends IResourceBase> {
  resourceName?: string;
  label?: string;
  signal?: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path?: string;
  handler?: IResourceActionFunction<T, TF> | IResourceVersioned<IResourceActionFunction<T, TF>>;
}


export interface IResourceActionContext<T, TF extends IResourceBase> {
  action: IResourceAction<T, TF>;
  requestEvent: RequestEvent;
  request: Request;
  response: HttpResponse;
  controller: ResourceController<T, TF>
  version?: string;
  // deno-lint-ignore no-explicit-any
  payload: any;
  // deno-lint-ignore no-explicit-any
  params: Record<string, any>;
  query: Record<string, string>;
  headers: Record<string, string>;
  setHeader: (header: string, value: string) => void
}


// deno-lint-ignore no-explicit-any
export type IResourceActionFunction<T, TF extends IResourceBase> = (context: IResourceActionContext<T, TF>) => any | Promise<any>
export type IResourceActionMultiFunction<T, TF extends IResourceBase> = IResourceActionFunction<T, TF> | IResourceActionFunction<T, TF>[] | Record<string, IResourceActionFunction<T, TF>>


export type IResourceVersioned<T> = {
  [version: string]: T
};

export type IResourceWare<T, TF extends IResourceBase> = (context: IResourceActionContext<T, TF>) => void | Promise<void>;
