import type { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';
import type { IResourceActionContext } from '../../../plugins/resource-maker/resource-router.d.ts';


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
