import { CaptchaTokenMaker } from './resource.ts';
import './model.ts';
import { Config } from '../../config.ts';


export const CaptchaTokenController = CaptchaTokenMaker.getController();


CaptchaTokenMaker.addValidations({ });


export async function generateCaptchaToken() {

  // const captcha = makeSvgCaptcha();

  const captchaToken = await CaptchaTokenController.create({
    document: {
      text: captcha.text,
      validUntil: Date.now() + Config.captcha.lifetime
    }
  });

  return {
    token: captchaToken,
    svg: captcha.svg
  };

}