import { Config } from './config.ts';

const timeStart = Date.now();


async function bootstrapDatabase() {
  const { bootstrap } = await import('./bootstrappers/database.ts');
  await bootstrap();
}

async function bootstrapHttp() {
  const { bootstrap } = await import('./bootstrappers/http.ts');
  await bootstrap(timeStart);
}


const services: Promise<unknown>[] = [];

if (Config.database.enabled) {
  services.push(bootstrapDatabase());
}

if (Config.http.enabled) {
  services.push(bootstrapHttp());
}

await Promise.all(services);
