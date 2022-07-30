import { RegisterTokenMaker } from './resource.ts';
import './model.ts';
import { isEmail, isPhoneNumber } from '../../../tools/validation.ts';


export const RegisterTokenController = RegisterTokenMaker.getController();


RegisterTokenMaker.addValidations({
  'email': [
    it => !it.email || isEmail(it.email) || 'email must be like aaa@bbb.ccc'
  ],
  'phoneNumber': [
    it => !it.phoneNumber || isPhoneNumber(it.phoneNumber) || 'phone number must be like +98xxxxxxxxxx'
  ]
});
