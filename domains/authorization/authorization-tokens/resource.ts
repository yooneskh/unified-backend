import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IAuthorizationTokenBase, IAuthorizationToken } from './interfaces.d.ts';


export const AuthorizationTokenMaker = new ResourceMaker<IAuthorizationTokenBase, IAuthorizationToken>('AuthorizationToken');
