import { AuthenticationTokenMaker } from './resource.ts';
import './model.ts';


export const AuthenticationTokenController = AuthenticationTokenMaker.getController();


AuthenticationTokenMaker.addValidations({ });
