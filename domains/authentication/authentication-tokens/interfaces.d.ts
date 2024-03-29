import type { IResourceBase } from 'resource-maker';


export interface IAuthenticationTokenBase<UT = string> {
  user: UT;
  token: string;
  valid: boolean;
  validUntil?: number;
  usedAt?: number[];
  invalidatedAt?: number;
} export interface IAuthenticationToken<UT = string> extends IAuthenticationTokenBase<UT>, IResourceBase {}
