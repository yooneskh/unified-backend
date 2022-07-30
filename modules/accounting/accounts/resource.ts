import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IAccountBase, IAccount } from './interfaces.d.ts';


export const AccountMaker = new ResourceMaker<IAccountBase, IAccount>('Account');
