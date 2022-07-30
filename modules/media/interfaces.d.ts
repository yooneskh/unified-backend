import type { IResourceBase } from '../../plugins/resource-maker/resource-model.d.ts';


export interface IMediaBase<OT = string> {
  owner?: OT;
  name: string;
  extension: string;
  size: number;
  type?: string;
  relativePath: string;
  path: string;
  variantRelatives?: Record<string, string>;
  variants?: Record<string, string>;
} export interface IMedia<OT = string> extends IMediaBase<OT>, IResourceBase {}
