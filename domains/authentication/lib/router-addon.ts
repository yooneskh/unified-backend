import { ResourceMaker } from '../../../plugins/resource-maker/maker.ts';
import type { IUser } from '../../users/interfaces.d.ts';
import type {} from '../../../plugins/resource-maker/router.d.ts';
import { getUserByToken } from './helper.ts';


declare module '../../../plugins/resource-maker/router.d.ts' {

  interface IResourceAction<T, TF> {
    requiresAuthentication?: boolean;
  }

  interface IResourceActionContext<T, TF> {
    token?: string;
    user?: IUser;
    userId?: string;
  }

}


ResourceMaker.addGlobalPreware(async context => {

  context.token = context.headers?.['authorization'] ?? context.queries?.['x-authorization'] ?? context.payload?.xAuthorization ?? undefined;

  if (context.token) {

    context.user = await getUserByToken(context.token);
    context.userId = context.user ? String(context.user._id) : undefined;

    if (!context.user) {
      throw new Error('invalid token');
    }

  }

  if (context.action.requiresAuthentication && !context.user) {
    throw new Error('you must provide your authentication token');
  }

});
