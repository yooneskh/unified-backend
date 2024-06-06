import { Config } from 'config';
import { IUnifiedApp } from 'unified-app';
import { install as installCaptchaTokens } from './captcha-tokens/mod.ts';
import { createCaptcha } from './utils/captcha-create.ts';


declare module 'unified-app' {
  interface IUnifiedAction {
    requiresCaptcha?: boolean,
  }
}


export function install(app: IUnifiedApp) {

  installCaptchaTokens(app);


  app.addMiddleware(async context => {

    if (!context.action.requiresCaptcha) {
      return;
    }


    const captchaId = context.headers['unified-captcha-id'];
    const captchaText = context.headers['unified-captcha-text'];


    const captchaToken = await app.captchaTokens.find({
      resourceId: captchaId,
      filter: {
        text: captchaText,
        validUntil: { $gte: Date.now() },
        resolved: false,
      },
    });

    if (!captchaToken) {
      throw new Error('invalid captcha');
    }


    await app.captchaTokens.update({
      resourceId: captchaId,
      payload: {
        resolved: true,
      },
    });

  });


  app.addAction({
    method: 'post',
    path: '/captcha-tokens/',
    handler: async () => {

      const captchaInfo = createCaptcha({
        length: Config.captcha.length,
        skew: 0.1,
      });


      const captchaToken = await app.captchaTokens.create({
        document: {
          text: captchaInfo.text,
          validUntil: Date.now() + Config.captcha.lifetime,
          resolved: false,
        },
      });


      return {
        captchaId: captchaToken._id,
        captchaData: captchaInfo.data,
      };

    },
  });

}