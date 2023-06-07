import { ResourceMaker } from 'resource-maker';
import type { IAuthorizationTokenBase, IAuthorizationToken } from './interfaces.d.ts';


export const AuthorizationTokenMaker = new ResourceMaker<IAuthorizationTokenBase, IAuthorizationToken>('AuthorizationToken');
