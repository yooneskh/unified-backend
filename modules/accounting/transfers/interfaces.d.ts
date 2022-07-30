import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface ITransferBase {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
} export interface ITransfer extends ITransferBase, IResourceBase {}
