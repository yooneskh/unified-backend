import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IPayticketBase {
  factor: string;
  gateway: string;
  amount: number;
  payUrl?: string;
  returnUrl?: string;
  locale?: string;
  resolved?: boolean;
  resolvedAt?: number;
  payed?: boolean;
  payedAt?: number;
  rejected?: boolean;
  rejectedAt?: number;
  rejectedFor?: string;
  meta: Record<string, unknown>;
} export interface IPayticket extends IPayticketBase, IResourceBase {}
