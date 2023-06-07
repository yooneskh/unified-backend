import type { IResourceBase } from 'resource-maker';


export interface IUserBase<PT = string> {
  name: string;
  email?: string;
  phoneNumber?: string;
  profile?: PT;
} export interface IUser<PT = string> extends IUserBase<PT>, IResourceBase {}
