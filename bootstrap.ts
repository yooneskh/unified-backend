import { Config } from 'config';
import { bootstrap as bootstrapDatabase } from 'unified-kv';
import { createApp } from './app.ts';


await bootstrapDatabase(Config.database.path);


const app = createApp();

app.listen({
  port: 8080,
});
