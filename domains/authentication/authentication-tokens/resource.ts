import { ResourceMaker } from 'resource-maker';
import type { IAuthenticationTokenBase, IAuthenticationToken } from './interfaces.d.ts';


export const AuthenticationTokenMaker = new ResourceMaker<IAuthenticationTokenBase, IAuthenticationToken>('AuthenticationToken');
