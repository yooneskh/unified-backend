import { bootstrap as bootstrapDatabase } from 'unified-kv';
import { createApp } from './app.ts';


await bootstrapDatabase();


const app = createApp();

app.listen({
  port: 8080,
});
