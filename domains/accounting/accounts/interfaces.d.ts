import { IResourceBase } from 'resource-maker';


export interface IAccountBase {
  name?: string;
  user?: string;
  identifier?: string;
  balance: number;
  acceptsInput: boolean;
  acceptsOutput: boolean;
  allowNegativeBalance: boolean;
  // deno-lint-ignore no-explicit-any
  meta?: any;
} export interface IAccount extends IAccountBase, IResourceBase {}
