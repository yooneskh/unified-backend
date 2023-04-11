import { ResourceMaker } from '../../plugins/resource-maker/maker.ts';
import type {} from '../../plugins/resource-maker/router.d.ts';
import { CaptchaTokenController } from './controller.ts';


export interface ICaptchaRouterAddonConfig {
  enabled: boolean;
}

declare module '../../plugins/resource-maker/router.d.ts' {
  interface IResourceAction<T, TF> {
    captcha?: ICaptchaRouterAddonConfig;
  }
}


ResourceMaker.addGlobalPreware(async context => {
  if (!context.action.captcha) return;

  const captchaId = context.headers['captcha-id'];
  const captchaText = context.headers['captcha-text'];

  if (!captchaId || !captchaText) {
    throw new Error('insufficient captcha informations');
  }


  const captcha = await CaptchaTokenController.find({ resourceId: captchaId });
  if (!captcha) {
    throw new Error('captcha not found');
  }

  if (captcha.resolved) {
    throw new Error('captcha is already resolved');
  }


  if (captcha.validUntil < Date.now()) {

    await CaptchaTokenController.update({
      resourceId: captchaId,
      payload: {
        resolved: true,
        resolvedAt: Date.now(),
        resolveFailure: true
      }
    });

    throw new Error('captcha expired');

  }

  if (captcha.text !== captchaText) {

    await CaptchaTokenController.update({
      resourceId: captchaId,
      payload: {
        resolved: true,
        resolvedAt: Date.now(),
        resolveFailure: true
      }
    });

    throw new Error(`wrong captcha text was ${captcha.text} gave ${captchaText}`);

  }


  await CaptchaTokenController.update({
    resourceId: captchaId,
    payload: {
      resolved: true,
      resolvedAt: Date.now()
    }
  });

});
