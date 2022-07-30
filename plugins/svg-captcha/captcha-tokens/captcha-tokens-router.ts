import { CaptchaTokenMaker } from './captcha-tokens-resource.ts';
import './captcha-tokens-controller.ts';
import { generateCaptchaToken } from './captcha-tokens-controller.ts';


CaptchaTokenMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.captcha-token.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.captcha-token.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.captcha-token.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.captcha-token.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.captcha-token.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.captcha-token.delete'
  },
  'generate-new': {
    method: 'get',
    path: '/generate/new',
    signal: 'Route.CaptchaToken.GenerateNew',
    rateLimit: {
      points: 3,
      windowDuration: 20,
      blockDuration: 20
    },
    provider: async () => {

      const data = await generateCaptchaToken();

      return {
        captchaId: data.token._id,
        svg: data.svg
      };

    }
  }
});


export const CaptchaTokenRouter = CaptchaTokenMaker.getRouter();
