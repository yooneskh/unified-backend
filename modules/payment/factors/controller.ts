import { FactorMaker } from './resource.ts';
import './model.ts';


export const FactorController = FactorMaker.getController();


FactorMaker.addValidations({ });
