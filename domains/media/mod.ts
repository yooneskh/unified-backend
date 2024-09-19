import { Config } from 'config';
import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IMediaBase {
  owner: string;
  name: string;
  extension: string;
  size: number;
  type?: string;
  relativePath: string;
  path: string;
  variantRelatives?: Record<string, string>;
  variants?: Record<string, string>;
} export interface IMedia extends IMediaBase, IBaseDocument {}

const MediaSchema: IUnifiedModel<IMediaBase> = {
  owner: {
    type: 'string',
    ref: 'User',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  extension: {
    type: 'string',
    required: true,
  },
  size: {
    type: 'number',
    required: true,
  },
  type: {
    type: 'string',
  },
  relativePath: {
    type: 'string',
    required: true,
  },
  path: {
    type: 'string',
    required: true,
  },
  variantRelatives: {
    type: 'object',
  },
  variants: {
    type: 'object',
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    media: IUnifiedController<IMediaBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('Media', MediaSchema);

  app.media = createUnifiedController<IMediaBase>(app, 'Media', MediaSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/media/meta',
      requirePermission: 'admin.media.meta',
      handler: () => {
        return app.models['Media'];
      },
    },
    'list': {
      template: 'list',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.list',
    },
    'count': {
      template: 'count',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.create',
    },
    'update': {
      template: 'update',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.update',
    },
    'replace': {
      template: 'replace',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.media,
      pathPrefix: '/media',
      requirePermission: 'admin.media.delete',
    },
    'upload': {
      method: 'post',
      path: '/media/upload',
      requirePermission: 'admin.media.upload',
      handler: async ({ body, user }) => {
  
        const formData = body as FormData;
        const file = formData.get('file') as File;
  
        if (!file) {
          throw new Error('file not provided');
        }
  
        if (!( file.size > 0 )) {
          throw new Error('file is empty');
        }
  
  
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const extension = file.name.slice(file.name.lastIndexOf('.') + 1);
        const size = file.size;
        const type = file.type;
  
        if (!name) {
          throw new Error('invalid file name');
        }
  
        if (!extension) {
          throw new Error('invalid file extension');
        }
  
        if (!type) {
          throw new Error('invalid file type');
        }
  
  
        const mediaBase = await app.media.create({
          document: {
            owner: user!._id,
            name,
            extension,
            size,
            type,
            relativePath: '--uploading--',
            path: '--uploading--'
          },
        });
  
  
        try {
  
          try {
            await Deno.mkdir(`../uploads/${Config.media.directory}`);
          }
          catch { /* directory exists */ }
  
  
          const relativeFilePath = `${Config.media.directory}/${mediaBase._id}.${extension}`;
          const fullPath = `${Config.media.baseUrl}/${relativeFilePath}`;
  
          await Deno.writeFile(`../uploads/${relativeFilePath}`, file.stream(), { createNew: true })
  
          return app.media.update({
            resourceId: mediaBase._id,
            payload: {
              relativePath: relativeFilePath,
              path: fullPath,
            },
          });
  
        }
        catch (error: unknown) {
  
          try {
  
            const faultyMedia = await app.media.retrieve({
              resourceId: mediaBase._id,
            });
  
            const deletePaths = [
              faultyMedia.relativePath,
              ...(Object.values(faultyMedia.variantRelatives ?? {}))
            ];
  
            for (const deletePath of deletePaths) {
              try {
                await Deno.remove(`./uploads/${deletePath}`);
              }
              catch (error) {
                console.error(error);
              }
            }
  
          }
          catch (error) {
            console.error(error);
          }
  
          await app.media.delete({
            resourceId: mediaBase._id,
          });
  
          throw error;
  
        }
  
      },
    },
  });


  app.on('media.delete', async (media: IMedia) => {
    await Deno.remove(`../uploads/${Config.media.directory}/${media._id}.${media.extension}`);
  });

}