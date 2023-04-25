import { registerMediaAddon } from '../globals.ts';
import { generateMediaVariants } from './variant-generator.ts';


registerMediaAddon(async media => {
  await generateMediaVariants(media);
});
