import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { ITransferBase, ITransfer } from './interfaces.d.ts';


export const TransferMaker = new ResourceMaker<ITransferBase, ITransfer>('Transfer');
