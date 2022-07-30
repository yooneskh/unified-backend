import { UserMaker } from './resource.ts';
import './model.ts';
import { isEmail, isPhoneNumber } from '../../tools/validation.ts';


export const UserController = UserMaker.getController();


UserMaker.addValidations({
  'email': [
    it => !it.email || isEmail(it.email) || 'email must be like aaa@bbb.ccc'
  ],
  'phoneNumber': [
    it => !it.phoneNumber || isPhoneNumber(it.phoneNumber) || 'phone number must be like +98xxxxxxxxxx'
  ]
});
