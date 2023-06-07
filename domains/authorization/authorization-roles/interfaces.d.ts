import type { IResourceBase } from 'resource-maker';


export interface IAuthorizationRoleBase {
  name: string;
  permissions: string[];
} export interface IAuthorizationRole extends IAuthorizationRoleBase, IResourceBase {}
