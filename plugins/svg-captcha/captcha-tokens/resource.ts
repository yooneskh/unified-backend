import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { ICaptchaTokenBase, ICaptchaToken } from './interfaces.d.ts';


export const CaptchaTokenMaker = new ResourceMaker<ICaptchaTokenBase, ICaptchaToken>('CaptchaToken');
