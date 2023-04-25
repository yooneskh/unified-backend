import type { IResourceBase } from '../../plugins/resource-maker/model.d.ts';


export interface IUserBase<PT = string> {
  name: string;
  email?: string;
  phoneNumber?: string;
  profile?: PT;
} export interface IUser<PT = string> extends IUserBase<PT>, IResourceBase {}
