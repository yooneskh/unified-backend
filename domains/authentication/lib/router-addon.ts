import { ResourceMaker } from 'resource-maker';
import type { IUser } from '../../users/interfaces.d.ts';
import type {} from 'resource-maker';
import { getUserByToken } from './helper.ts';


declare module 'resource-maker' {

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
