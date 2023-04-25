import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import { IPayticketBase, IPayticket } from './interfaces.d.ts';


export const PayticketMaker = new ResourceMaker<IPayticketBase, IPayticket>('Payticket');
