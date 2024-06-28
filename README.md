# Unified Backend

This is a started template for a SaaS application backend implemented using Deno. It provides common functionality needed in every application and a common ground to quickly add features on top of them.

## Architecture

This code is based on the Domain Driven Design architecture. Each aspect of the business logic is a domain which is plugged into the application. The `app` itself is a common barebone for all of the logic of application to be applied on top of it.

## Configuration

Open and edit the `./config.ts` file and edit the configuration related to any of the domains.

## Deployment

You can run the app using this command

```bash
deno run --unstable-kv --unstable-ffi --allow-read=./ --allow-write=./ --allow-net bootstrap.ts
```

This will run the app and make it listen to the `port` defined in the `./config.ts`.

You can also compile the application into a single binary so the Deno itself is not needed to be installed where you want to run the app.

```bash
deno compile --unstable-kv --unstable-ffi --allow-read=./ --allow-write=./ --allow-net bootstrap.ts
```

## Features

This code has these features built in

- Authentication
  - Users Entity
  - Token based authentication
  - Login with email
  - Email SSO Code (through Resend)
- Authorization
  - Permission based authorization
  - Permissions and Roles for Users
- Media Upload
  - Upload using `FormData` request
  - Media Entity uploaded once and referenced in other entities multiple times
- Settings
  - Special entities which will store only 1 record of themselves. Useful for dynamic configurations
- Utilities
  - Captcha
  - Rate Limiter
  - Application Wide Event Emitter

## Plugin Based Development

Each domain can add the required functionality to the `app`.

Example: Logger
```ts
import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedActionContext {
    timeStart?: number;
    timeEnd?: number;
  }
}


export function install(app: IUnifiedApp) {

  app.addMiddleware(context => {
    context.timeStart = Date.now();
  });

  app.addPostware(context => {
    context.timeEnd = Date.now();
    console.log(`${context.action.method?.toLowerCase()} ${context.action.path} - ${context.timeEnd! - context.timeStart!}ms`);
  });

}
```

Example: Event Emitter
```ts
import { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedApp {
    listeners: { event: string; callback: (...args: any) => void; }[];
    on: (event: string, callback: (...args: any) => void) => void;
    emit: (event: string, ...args: any) => void;
  }
}


export function install(app: IUnifiedApp) {

  app.listeners = [];

  app.on = (event, callback) => {
    app.listeners!.push({
      event,
      callback,
    });
  };

  app.emit = (event, ...args) => {
    for (const listener of app.listeners!) {
      if (listener.event === event) {
        listener.callback(...args);
      }
    }
  };

}
```

This enables neat separation and decoupling in the codebase.

```ts
import { IUnifiedApp } from 'unified-app';
import { install as installUnifiedEventEmitter } from '../unified-event-emitter/mod.ts';
import { install as installUnifiedLogger } from '../unified-logger/mod.ts';
import { install as installUnifiedResources } from '../unified-resources/mod.ts';
import { install as installUnifiedCaptcha } from '../unified-captcha/mod.ts';
import { install as installUnifiedRateLimiter } from '../unified-rate-limiter/mod.ts';


export function install(app: IUnifiedApp) {
  installUnifiedEventEmitter(app);
  installUnifiedLogger(app);
  installUnifiedResources(app);
  installUnifiedCaptcha(app);
  installUnifiedRateLimiter(app);
}
```