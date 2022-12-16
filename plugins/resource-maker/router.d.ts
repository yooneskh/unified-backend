import { ResourceController } from './controller.ts';
import type { IResourceBase } from './model.d.ts';
import type { IRouteHandlerReturn } from '../../deps.ts';


export { IRouteHandlerReturn };

export interface IResourceAction<T, TF extends IResourceBase> {
  resourceName?: string;
  label?: string;
  signal?: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
  path?: string;
  handler?: IResourceActionFunction<T, TF> | IResourceVersioned<IResourceActionFunction<T, TF>>;
}


export interface IResourceActionContext<T, TF extends IResourceBase> {
  action: IResourceAction<T, TF>;
  request: Request;
  controller: ResourceController<T, TF>
  version?: string;
  // deno-lint-ignore no-explicit-any
  payload: any;
  // deno-lint-ignore no-explicit-any
  params: Record<string, any>;
  queries: Record<string, string>;
  headers: Record<string, string>;
}


export type IResourceActionFunction<T, TF extends IResourceBase> = (context: IResourceActionContext<T, TF>) => IRouteHandlerReturn | Promise<IRouteHandlerReturn>

export type IResourceActionMultiFunction<T, TF extends IResourceBase> = IResourceActionFunction<T, TF> | IResourceActionFunction<T, TF>[] | Record<string, IResourceActionFunction<T, TF>>


export type IResourceVersioned<T> = {
  [version: string]: T
};

export type IResourceWare<T, TF extends IResourceBase> = (context: IResourceActionContext<T, TF>) => void | Promise<void>;
