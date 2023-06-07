import { ResourceMaker } from 'resource-maker';
import type { IVerificationTokenBase, IVerificationToken } from './interfaces.d.ts';


export const VerificationTokenMaker = new ResourceMaker<IVerificationTokenBase, IVerificationToken>('VerificationToken');
