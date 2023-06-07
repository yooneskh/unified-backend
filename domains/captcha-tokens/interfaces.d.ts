import { IResourceBase } from 'resource-maker';


export interface ICaptchaTokenBase {
  text: string;
  validUntil: number;
  resolved?: boolean;
  resolvedAt?: number;
  resolveFailure?: boolean;
} export interface ICaptchaToken extends ICaptchaTokenBase, IResourceBase {}
