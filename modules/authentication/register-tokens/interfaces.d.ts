import type { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IRegisterTokenBase {
  name: string;
  phoneNumber?: string;
  email?: string;
  used?: boolean;
  usedAt?: number;
} export interface IRegisterToken extends IRegisterTokenBase, IResourceBase {}
