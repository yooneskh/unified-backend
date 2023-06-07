import { ResourceMaker } from 'resource-maker';
import type { IResourceActionMultiFunction } from 'resource-maker';
import { executeActionMultiFunction } from 'resource-maker';
import type { IAuthorizationRole } from '../authorization-roles/interfaces.d.ts';
import { getAuthorizationInfoForUser, matchPermission } from './helper.ts';


declare module 'resource-maker' {

  interface IResourceAction<T, TF> {
    permission?: string;
    permissions?: string[];
    anyPermissions?: string[];
    permissionValidator?: IResourceActionMultiFunction<T, TF>
  }

  interface IResourceActionContext<T, TF> {
    userPermissions?: string[];
    userRoles?: IAuthorizationRole[];
    hasPermission: (permission: string) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
  }

}


ResourceMaker.addGlobalPreware(async context => {

  const { action, userId } = context;
  const { permission, permissions, anyPermissions, permissionValidator } = action;


  context.hasPermission = (p: string) => {
    if (!context.userPermissions) return false;
    return context.userPermissions.some(permit => matchPermission(permit, p));
  };

  context.hasAllPermissions = (p: string[]) => {
    if (!context.userPermissions) return false;

    return p.every(neededP =>
      context.userPermissions!.some(permit => matchPermission(permit, neededP))
    );

  };

  context.hasAnyPermission = (p: string[]) => {
    if (!context.userPermissions) return false;

    return p.some(neededP =>
      context.userPermissions!.some(permit => matchPermission(permit, neededP))
    );

  };


  if (userId) {
    const info = await getAuthorizationInfoForUser(userId);
    context.userPermissions = info.permissions;
    context.userRoles = info.roles;
  }


  if (permission) {
    if (!userId) throw new Error('unauthorized access');
    if (!context.hasPermission(permission)) throw new Error('unauthorized access');
  }

  if (permissions) {
    if (!userId) throw new Error('unauthorized access');
    if (!context.hasAllPermissions(permissions)) throw new Error('unauthorized access');
  }

  if (anyPermissions) {
    if (!userId) throw new Error('unauthorized access');
    if (!context.hasAnyPermission(anyPermissions)) throw new Error('unauthorized access');
  }

  if (permissionValidator) {
    try {
      await executeActionMultiFunction(permissionValidator, context);
    }
    catch (error) {
      throw new Error(`unauthorized access${error.message ? `: ${error.message}` : ''}`);
    }
  }

});
