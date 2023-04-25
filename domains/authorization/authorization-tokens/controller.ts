import { AuthorizationTokenMaker } from './resource.ts';
import './model.ts';


export const AuthorizationTokenController = AuthorizationTokenMaker.getController();


AuthorizationTokenMaker.addValidations({ });
