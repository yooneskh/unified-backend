import { ResourceMaker } from 'resource-maker';
import { ICaptchaTokenBase, ICaptchaToken } from './interfaces.d.ts';


export const CaptchaTokenMaker = new ResourceMaker<ICaptchaTokenBase, ICaptchaToken>('CaptchaToken');
