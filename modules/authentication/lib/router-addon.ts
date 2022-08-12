import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import type { IUser } from '../../users/interfaces.d.ts';
import type {} from '../../../plugins/resource-maker/resource-router.d.ts';
import { getUserByToken } from './helper.ts';


declare module '../../../plugins/resource-maker/resource-router.d.ts' {

  interface IResourceAction<T, TF> {
    requiresAuthentication?: boolean;
  }

  interface IResourceActionContext<T, TF> {
    token?: string;
    user?: IUser;
  }

}


ResourceMaker.addGlobalPreware(async context => {

  context.token = context.headers?.['authorization'] ?? context.query?.['x-authorization'] ?? context.payload?.xAuthorization ?? undefined;

  if (context.token) {

    context.user = await getUserByToken(context.token);

    if (!context.user) {
      throw new Error('invalid token');
    }

  }

  if (context.action.requiresAuthentication && !context.user) {
    throw new Error('you must provide your authentication token');
  }

});
