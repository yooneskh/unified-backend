import { ResourceMaker } from 'resource-maker';
import type { IAuthorizationRoleBase, IAuthorizationRole } from './interfaces.d.ts';


export const AuthorizationRoleMaker = new ResourceMaker<IAuthorizationRoleBase, IAuthorizationRole>('AuthorizationRole');
