import type { IResourceBase } from 'resource-maker';


export interface IAuthorizationTokenBase<RT = string> {
  user: string;
  permissions?: string[];
  roles?: RT[];
} export interface IAuthorizationToken<RT = string> extends IAuthorizationTokenBase<RT>, IResourceBase {}
