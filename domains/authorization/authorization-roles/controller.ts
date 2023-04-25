import { AuthorizationRoleMaker } from './resource.ts';
import './model.ts';


export const AuthorizationRoleController = AuthorizationRoleMaker.getController();


AuthorizationRoleMaker.addValidations({ });
