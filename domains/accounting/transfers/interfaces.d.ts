import { IResourceBase } from 'resource-maker';


export interface ITransferBase {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
} export interface ITransfer extends ITransferBase, IResourceBase {}
