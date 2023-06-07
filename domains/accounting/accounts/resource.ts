import { ResourceMaker } from 'resource-maker';
import { IAccountBase, IAccount } from './interfaces.d.ts';


export const AccountMaker = new ResourceMaker<IAccountBase, IAccount>('Account');
