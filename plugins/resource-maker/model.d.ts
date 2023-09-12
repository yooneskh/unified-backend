// deno-lint-ignore-file no-explicit-any
import { ObjectId } from 'yongo';


export interface IResourceBase {
  _id: ObjectId;
  createdAt: number;
  updatedAt: number;
}

export interface IResourceProperty {
  type: 'string' | 'number' | 'boolean' | 'series' | 'object';
  array?: boolean;
  ref?: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  handlerElement?: string;
  /* series */
  seriesIdentifier?: string;
  seriesLoopTo?: string;
  seriesBase?: Record<string, unknown>;
  seriesSchema?: IResourceProperties<any, any>;
  seriesReportGroupBy?: string;
  itemWidth?: number;
  /* validation */
  vIf?: any;
  validator?: string | RegExp | ((it: any) => void | boolean | string);
  /* meta */
  title?: string;
  titleable?: boolean;
  items?: string[] | { value: string, title: string }[];
  itemValue?: string;
  itemText?: string;
  width?: number;
  variants?: Record<string, Partial<IResourceProperty>>;
  dir?: string;
  hideInTable?: boolean;
  hidden?: boolean;
  longText?: boolean;
  richText?: boolean;
  labelFormat?: string;
  valueFormat?: string;
  dateType?: 'date' | 'time' | 'datetime';
  geo?: 'point';
  defaultCenter?: [longitude: number, latitude: number];
  defaultZoom?: number;
  disabled?: boolean;
  /* temporary */
  nonCreating?: boolean;
}

export type IResourceProperties<T, TF> = {
  [key in keyof T] -?: IResourceProperty;
}
