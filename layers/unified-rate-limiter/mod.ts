import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedAction {
    rateLimit?: {
      points: number;
      windowDuration: number;
      blockDuration: number;
    };
  }
}


export function install(app: IUnifiedApp) {

  const rateLimitPool = new Map<string, Map<string, {
    points: number;
    last?: number;
    blockedUntil?: number;
  }>>();


  app.addMiddleware(context => {

    const rule = context.action.rateLimit;

    if (!rule) {
      return;
    }


    const actionKey = [context.action.method, context.action.path].join(' ');
    const userKey = [context.request.headers.get('x-forwarded-for')].join(' ');

    console.log('rate limit user key: ' + userKey);

    if (!rateLimitPool.has(actionKey)) {
      rateLimitPool.set(actionKey, new Map());
    }


    const rateLimitMap = rateLimitPool.get(actionKey)!;

    if (!rateLimitMap.has(userKey)) {
      rateLimitMap.set(userKey, {
        points: rule.points,
      });
    }


    const target = rateLimitMap.get(userKey)!;


    if (target.blockedUntil) {
      if (Date.now() > target.blockedUntil) {
        target.blockedUntil = 0;
        target.points = rule.points;
      }
      else {
        throw new Error(`rate limited until ${new Date(target.blockedUntil)}`);
      }
    }

    if (!target.last) {
      target.points--;
      target.last = Date.now();
    }
    else if (Date.now() > target.last + rule.windowDuration) {
      target.points = rule.points - 1;
      target.last = Date.now();
    }
    else if (target.points > 0) {
      target.points--;
    }
    else if (target.points <= 0) {

      target.points = 0;
      target.last = 0;
      target.blockedUntil = Date.now() + rule.blockDuration;

      throw new Error(`rate limited until ${new Date(target.blockedUntil)}`);
      
    }

  });

}