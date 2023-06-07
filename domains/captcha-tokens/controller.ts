import { CaptchaTokenMaker } from './resource.ts';
import './model.ts';
import { Config } from 'config';
import { createCaptcha } from '../../plugins/captcha-maker/mod.ts';


export const CaptchaTokenController = CaptchaTokenMaker.getController();


CaptchaTokenMaker.addValidations({ });


export async function generateCaptchaToken() {

  const captcha = createCaptcha({});

  const captchaToken = await CaptchaTokenController.create({
    document: {
      text: captcha.text,
      validUntil: Date.now() + Config.captcha.lifetime
    }
  });


  return {
    token: captchaToken,
    data: captcha.data,
  };

}