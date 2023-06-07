import { ResourceMaker } from 'resource-maker';
import { IFactorBase, IFactor } from './interfaces.d.ts';


export const FactorMaker = new ResourceMaker<IFactorBase, IFactor>('Factor');
