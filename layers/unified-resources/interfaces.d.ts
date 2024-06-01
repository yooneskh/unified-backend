import type { Filter, IBaseDocument } from 'unified-kv';


declare module 'unified-app' {

  interface IUnifiedApp {
    models: Record<string, IUnifiedModel<unknown>>;
    addModel: (model: string, schema: IUnifiedModel<unknown>) => void;
  }

}


export interface IUnifiedModelBase {
  _id: string;
  createdAt: number;
  updatedAt?: number;
}

export type IUnifiedModel<T> = {
  [key in keyof T] -?: {
    type: 'string' | 'number' | 'boolean' | 'series' | 'object';
    array?: boolean;
    ref?: string;
    required?: boolean;
    default?: unknown;
    enum?: unknown[];
    handlerElement?: string;
    /* series */
    seriesIdentifier?: string;
    seriesLoopTo?: string;
    seriesBase?: unknown;
    seriesSchema?: IUnifiedModel<unknown>;
    seriesReportGroupBy?: string;
    seriesColumns?: number;
    /* validation */
    vIf?: unknown;
    validator?: string | RegExp | ((it: unknown) => void | boolean | string);
    /* meta */
    title?: string;
    titleable?: boolean;
    items?: string[] | { value: string, title: string }[];
    itemValue?: string;
    itemText?: string;
    width?: number;
    variants?: Record<string, Partial<IUnifiedModel<unknown>>>;
    dir?: string;
    hideInTable?: boolean;
    hidden?: boolean;
    longText?: boolean;
    richText?: boolean;
    labelFormat?: string;
    valueFormat?: string;
    dateType?: 'date' | 'time' | 'datetime';
    geo?: 'point';
    defaultCenter?: [ longitude: number, latitude: number ];
    defaultZoom?: number;
    disabled?: boolean;
    /* temporary */
    nonCreating?: boolean;
  };
}


export interface IUnifiedController<T> {
  list: (context: IUnifiedControllerContext<T>) => Promise<(T & IBaseDocument)[]>;
  retrieve: (context: IUnifiedControllerContext<T>) => Promise<T & IBaseDocument>;
  find: (context: IUnifiedControllerContext<T>) => Promise<(T & IBaseDocument) | undefined>;
  count: (context: IUnifiedControllerContext<T>) => Promise<number>;
  exists: (context: IUnifiedControllerContext<T>) => Promise<boolean>;
  notExists: (context: IUnifiedControllerContext<T>) => Promise<boolean>;
  create: (context: IUnifiedControllerContext<T>) => Promise<T & IBaseDocument>;
  update: (context: IUnifiedControllerContext<T>) => Promise<T & IBaseDocument>;
  replace: (context: IUnifiedControllerContext<T>) => Promise<T & IBaseDocument>;
  delete: (context: IUnifiedControllerContext<T>) => Promise<T & IBaseDocument>;
}

export interface IUnifiedControllerContext<T> {
  resourceId?: string;
  filter?: Filter<T & IBaseDocument>;
  populate?: Record<string, string[]>;
  select?: string[];
  limit?: number;
  skip?: number;
  document?: T;
  payload?: Partial<T>;
}