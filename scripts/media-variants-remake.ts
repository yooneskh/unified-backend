import { bootstrap } from '../bootstrappers/bootstrap-database.ts';
import { MediaController } from '../modules/media/media-controller.ts';
import { generateMediaVariants } from '../modules/media/lib/media-variant-generator.ts';


await bootstrap();


try {

  const medias = await MediaController.list({});

  for (const mediaIndex in medias) {
    const newMedia = await generateMediaVariants(medias[mediaIndex]);
    console.log(`${Number(mediaIndex) + 1} / ${medias.length}`, newMedia.variants);
  }

}
catch (error: unknown) {
  console.error(error);
}


Deno.exit(0);
