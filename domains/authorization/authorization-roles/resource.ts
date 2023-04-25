import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IAuthorizationRoleBase, IAuthorizationRole } from './interfaces.d.ts';


export const AuthorizationRoleMaker = new ResourceMaker<IAuthorizationRoleBase, IAuthorizationRole>('AuthorizationRole');
