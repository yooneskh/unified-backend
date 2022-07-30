import { VerificationTokenMaker } from './resource.ts';
import './model.ts';


export const VerificationTokenController = VerificationTokenMaker.getController();


VerificationTokenMaker.addValidations({ });
