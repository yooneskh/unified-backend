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


  app.addMiddlewares({
    'check-captcha': async context => {

      if (!context.action.requiresCaptcha) {
        return;
      }
  
  
      const captchaId = context.headers['captcha-id'];
      const captchaText = context.headers['captcha-text'];
  
  
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
  
    },
  });

  app.addActions({
    'create': {
      method: 'post',
      path: '/captcha-tokens/',
      rateLimit: {
        points: 10,
        windowDuration: 60_000 * 5,
        blockDuration: 60_000 * 10,
      },
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
    },
  });

}