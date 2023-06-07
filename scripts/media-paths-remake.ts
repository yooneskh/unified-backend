import { Config } from 'config';
import { bootstrap } from '../bootstrappers/database.ts';
import { MediaController } from '../domains/media/controller.ts';


await bootstrap();


try {

  let index = 0;
  const medias = await MediaController.list({});

  for (const media of medias) {

    const newMedia = await MediaController.update({
      resourceId: media._id,
      payload: {
        path: `${Config.media.baseUrl}/${media.relativePath}`,
        variants: !media.variantRelatives ? undefined : (
          Object.fromEntries(
            Object.entries(media.variantRelatives).map(([key, value]) => [
              key,
              `${Config.media.baseUrl}/${value}`
            ])
          )
        )
      }
    });

    console.log(`${++index} / ${medias.length}`, newMedia.path);

  }

}
catch (error: unknown) {
  console.error(error);
}


Deno.exit(0);
