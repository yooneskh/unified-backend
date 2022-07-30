import { MediaMaker } from './resource.ts';
import './controller.ts';
import { copy, ensureFile, readerFromStreamReader } from '../../deps.ts';
import { Config } from '../../config.ts';
import { getMediaAddons, getMediaValidators } from './globals.ts';
import { EventEmitter } from '../../services/event-emitter.ts';


MediaMaker.addActions({
  'list': {
    template: 'list'
  },
  'count': {
    template: 'count'
  },
  'retrieve': {
    template: 'retrieve'
  },
  'create': {
    template: 'create'
  },
  'update': {
    template: 'update'
  },
  'delete': {
    template: 'delete'
  },
  'upload': {
    method: 'post',
    path: '/upload',
    signal: 'Route.Media.Upload',
    provider: async ({ requestEvent, controller, user }) => {

      const file = requestEvent.body.file as File;
      if (!file) throw new Error('file not provided');
      if (!( file.size > 0 )) throw new Error('file is invalid');

      const name = file.name.slice(0, file.name.lastIndexOf('.'));
      const extension = file.name.slice(file.name.lastIndexOf('.') + 1);
      const size = file.size;
      const type = file.type;

      if (!name) throw new Error('invalid file name');
      if (!extension) throw new Error('invalid file extension');
      if (!type) throw new Error('invalid file type');

      const mediaBase = await controller.create({
        document: {
          owner: String(user?._id),
          name,
          extension,
          size,
          type,
          relativePath: '--uploading--',
          path: '--uploading--'
        }
      });

      try {

        const relativeFilePath = `${Config.media.directory}/${mediaBase._id}.${extension}`;
        await ensureFile(`./${relativeFilePath}`);


        const stream = await file.stream();
        const reader = readerFromStreamReader(stream.getReader());
        const output = await Deno.open(`./${relativeFilePath}`, { write: true, create: true, truncate: true });

        await copy(reader, output);


        const fullPath = `${Config.media.baseUrl}/${relativeFilePath}`;

        const newMedia = await controller.update({
          resourceId: mediaBase._id,
          payload: {
            relativePath: relativeFilePath,
            path: fullPath
          }
        });


        for (const validator of getMediaValidators()) {
          await validator(newMedia);
        }

        for (const addon of getMediaAddons()) {
          await addon(newMedia);
        }


        const finalizedMedia = await controller.retrieve({ resourceId: newMedia._id });
        EventEmitter.emit('Resource.Media.Uploaded', String(finalizedMedia._id), finalizedMedia);
        return finalizedMedia;

      }
      catch (error: unknown) {

        try {

          const faultyMedia = await controller.retrieve({ resourceId: mediaBase._id });

          const deletePaths = [
            faultyMedia.relativePath,
            ...(Object.values(faultyMedia.variantRelatives ?? {}))
          ];

          for (const deletePath of deletePaths) {
            try {
              await Deno.remove(deletePath);
            }
            catch {/*  */}
          }

        }
        catch {/*  */}

        await controller.delete({ resourceId: mediaBase._id });
        throw error;

      }

    }
  }
});


export const MediaRouter = MediaMaker.getRouter();
