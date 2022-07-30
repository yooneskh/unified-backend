import type { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IAuthorizationTokenBase<RT = string> {
  user: string;
  permissions?: string[];
  roles?: RT[];
} export interface IAuthorizationToken<RT = string> extends IAuthorizationTokenBase<RT>, IResourceBase {}
