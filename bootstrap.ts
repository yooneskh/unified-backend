import { Config } from 'config';

import { bootstrap as bootstrapDatabase } from './bootstrappers/database.ts';
import { bootstrap as bootstrapHttp } from './bootstrappers/http.ts';


const timeStart = Date.now();
const services: Promise<unknown>[] = [];

if (Config.database.enabled) {
  services.push(bootstrapDatabase());
}

if (Config.http.enabled) {
  services.push(bootstrapHttp(timeStart));
}

await Promise.all(services);
