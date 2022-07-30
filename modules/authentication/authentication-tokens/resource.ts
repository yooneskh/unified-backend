import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import type { IAuthenticationTokenBase, IAuthenticationToken } from './interfaces.d.ts';


export const AuthenticationTokenMaker = new ResourceMaker<IAuthenticationTokenBase, IAuthenticationToken>('AuthenticationToken');
