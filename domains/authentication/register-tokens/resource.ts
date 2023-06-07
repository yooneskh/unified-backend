import { ResourceMaker } from 'resource-maker';
import type { IRegisterTokenBase, IRegisterToken } from './interfaces.d.ts';


export const RegisterTokenMaker = new ResourceMaker<IRegisterTokenBase, IRegisterToken>('RegisterToken');
