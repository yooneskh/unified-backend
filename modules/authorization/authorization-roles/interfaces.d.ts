import type { IResourceBase } from '../../../plugins/resource-maker/model.d.ts';


export interface IAuthorizationRoleBase {
  name: string;
  permissions: string[];
} export interface IAuthorizationRole extends IAuthorizationRoleBase, IResourceBase {}
