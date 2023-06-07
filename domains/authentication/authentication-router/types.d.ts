import type { IResourceBase } from 'resource-maker';
import type { IResourceActionContext } from 'resource-maker';


interface IAuthResultDone {
  needsVerification: false;
  token: string;
}

interface IAuthResultNeedsVerification {
  needsVerification: true;
  verificationToken: string;
}

export type IAuthResult = IAuthResultDone | IAuthResultNeedsVerification;


export interface IAuthProvider {
  identifier: string;
  login: (context: IResourceActionContext<unknown, IResourceBase>) => IAuthResult | Promise<IAuthResult>;
  register: (context: IResourceActionContext<unknown, IResourceBase>) => IAuthResult | Promise<IAuthResult>;
  verify: (context: IResourceActionContext<unknown, IResourceBase>) => string | Promise<string>;
}
