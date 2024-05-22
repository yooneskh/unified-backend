

declare module 'unified-app' {

  interface IUnifiedApp {
    models: Record<string, IUnifiedModel>;
    addModel: (model: string, schema: IUnifiedModel) => void;
  }

}


export interface IUnifiedModelBase {
  _id: string;
  createdAt: number;
  updatedAt?: number;
}

export interface IUnifiedModel {
  [key: string]: {
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
    seriesSchema?: IUnifiedModel;
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
    variants?: Record<string, Partial<IUnifiedModel>>;
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
  list: () => Promise<T[]>;
  retrieve: () => Promise<T>;
  find: () => Promise<T | undefined>;
  count: () => Promise<number>;
  exists: () => Promise<boolean>;
  notExists: () => Promise<boolean>;
  create: () => Promise<T>;
  update: () => Promise<T>;
  replace: () => Promise<T>;
  delete: () => Promise<T>;
}
