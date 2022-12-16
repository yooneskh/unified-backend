import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import { IFactorBase, IFactor } from './interfaces.d.ts';


export const FactorMaker = new ResourceMaker<IFactorBase, IFactor>('Factor');
