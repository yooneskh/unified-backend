import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IFactorBase, IFactor } from './interfaces.d.ts';


export const FactorMaker = new ResourceMaker<IFactorBase, IFactor>('Factor');
