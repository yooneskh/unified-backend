import { ResourceMaker } from 'resource-maker';
import { IPayticketBase, IPayticket } from './interfaces.d.ts';


export const PayticketMaker = new ResourceMaker<IPayticketBase, IPayticket>('Payticket');
