import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface ICaptchaTokenBase {
  text: string;
  validUntil: number;
  resolved: boolean;
} export interface ICaptchaToken extends ICaptchaTokenBase, IBaseDocument {}

const CaptchaTokenSchema: IUnifiedModel<ICaptchaTokenBase> = {
  text: {
    type: 'string',
    required: true,
  },
  validUntil: {
    type: 'number',
    required: true,
  },
  resolved: {
    type: 'boolean',
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    captchaTokens: IUnifiedController<ICaptchaTokenBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('CaptchaToken', CaptchaTokenSchema);

  app.captchaTokens = createUnifiedController<ICaptchaTokenBase>('CaptchaToken', CaptchaTokenSchema);

}