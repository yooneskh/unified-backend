import { ResourceMaker } from 'resource-maker';
import type { IUserBase, IUser } from './interfaces.d.ts';


export const UserMaker = new ResourceMaker<IUserBase, IUser>('User');
