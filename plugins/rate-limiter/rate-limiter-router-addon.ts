import { ResourceMaker } from '../resource-maker/resource-maker.ts';
import { RateLimiterFlexible } from '../../deps.ts';
import { HandleableError } from '../error/handleable-error.ts';
import type {} from '../resource-maker/resource-router.d.ts';


export interface IRateLimiterConfig {
  points: number;
  windowDuration: number;
  blockDuration: number;
}

declare module '../resource-maker/resource-router.d.ts' {
  interface IResourceAction<T, TF> {
    rateLimit?: IRateLimiterConfig;
  }
}


export class RateLimiterError extends HandleableError {
  public code = 1100;
  public httpStatus = 429;
  public defaultMessage = 'too many requests.';
  public defaultResponseMessage = 'مورد خواسته شده یافت نشد.';
}


let globalRateLimiter: IRateLimiterConfig | undefined = undefined;

export function setGlobalRateLimit(config: IRateLimiterConfig) {
  globalRateLimiter = config;
}


// deno-lint-ignore no-explicit-any
const rateLimiters: Map<string, any> = new Map();

ResourceMaker.addGlobalPreware(async context => {

  const rateLimit = context.action.rateLimit ?? globalRateLimiter;
  if (!rateLimit) return;

  const { action: { signal }, setHeader } = context;

  if (!rateLimiters.has(signal!)) {
    rateLimiters.set(
      signal!,
      // deno-lint-ignore no-explicit-any
      new (RateLimiterFlexible.default as any).RateLimiterMemory({
        points: rateLimit.points,
        duration: rateLimit.windowDuration,
        blockDuration: rateLimit.blockDuration
      })
    );
  }

  try {

    const key = context.headers['x-forwarded-for'] || context.requestEvent.request.headers.get('host') || '---';
    const rateLimitResult = await rateLimiters.get(signal!)!.consume(key);

    setHeader('X-RateLimit-Limit', String(rateLimit.points));
    setHeader('X-RateLimit-Remaining', String(rateLimitResult.remainingPoints));
    setHeader('X-RateLimit-Reset', String(new Date(Date.now() + rateLimitResult.msBeforeNext)));

  }
  catch (error) {

    const seconds = Math.ceil(error.msBeforeNext / 1000);

    throw new RateLimiterError(
      `too many reqeusts for ${signal} - ${error.remainingPoints} remaining of ${rateLimit.points} - reset in ${error.msBeforeNext}`,
      `تعداد درخواست‌های شما از حد مجاز فراتر رفته است. شما باید ${seconds} ثانیه صبر کنید.`,
      {
        'Retry-After': String(seconds),
        'X-RateLimit-Limit': String(rateLimit.points),
        'X-RateLimit-Remaining': String(error.remainingPoints),
        'X-RateLimit-Reset': String(new Date(Date.now() + error.msBeforeNext))
      }
    );

  }

});
