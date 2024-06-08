import { IUnifiedApp } from 'unified-app';
import { install as installUnifiedLogger } from '../unified-logger/mod.ts';
import { install as installUnifiedResources } from '../unified-resources/mod.ts';
import { install as installUnifiedCaptcha } from '../unified-captcha/mod.ts';
import { install as installUnifiedRateLimiter } from '../unified-rate-limiter/mod.ts';


export function install(app: IUnifiedApp) {
  installUnifiedLogger(app);
  installUnifiedResources(app);
  installUnifiedCaptcha(app);
  installUnifiedRateLimiter(app);
}