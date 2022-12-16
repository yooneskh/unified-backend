import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IRegisterTokenBase, IRegisterToken } from './interfaces.d.ts';


export const RegisterTokenMaker = new ResourceMaker<IRegisterTokenBase, IRegisterToken>('RegisterToken');
