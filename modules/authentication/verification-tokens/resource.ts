import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IVerificationTokenBase, IVerificationToken } from './interfaces.d.ts';


export const VerificationTokenMaker = new ResourceMaker<IVerificationTokenBase, IVerificationToken>('VerificationToken');
