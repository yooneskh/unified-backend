import type { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IVerificationTokenBase<UT = string, RT = string> {
  user?: UT;
  registerToken?: RT;
  channel: 'sms' | 'email';
  channelIdentifier: string;
  code: string;
  used?: boolean;
  usedAt?: number;
} export interface IVerificationToken<UT = string, RT = string> extends IVerificationTokenBase<UT, RT>, IResourceBase {}
