import type { IResourceBase } from 'resource-maker';


export interface IRegisterTokenBase {
  name: string;
  phoneNumber?: string;
  email?: string;
  used?: boolean;
  usedAt?: number;
} export interface IRegisterToken extends IRegisterTokenBase, IResourceBase {}
