import { ResourceMaker } from 'resource-maker';
import { ITransferBase, ITransfer } from './interfaces.d.ts';


export const TransferMaker = new ResourceMaker<ITransferBase, ITransfer>('Transfer');
