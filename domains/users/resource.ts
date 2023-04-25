import { ResourceMaker } from '../../plugins/resource-maker/maker.ts';
import type { IUserBase, IUser } from './interfaces.d.ts';


export const UserMaker = new ResourceMaker<IUserBase, IUser>('User');
