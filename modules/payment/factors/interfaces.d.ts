import { IResourceBase } from '../../../plugins/resource-maker/model.d.ts';


export interface IFactorBase {
  name: string;
  amount: number;
  user?: string;
  payed?: boolean;
  payedAt?: number;
  payticket?: string;
  meta: Record<string, unknown>;
} export interface IFactor extends IFactorBase, IResourceBase {}
