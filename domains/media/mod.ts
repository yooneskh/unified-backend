import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import { createUnifiedController } from 'unified-resources';


export interface IMedia {
  owner: string;
  name: string;
  extension: string;
  size: number;
  type?: string;
  relativePath: string;
  path: string;
  variantRelatives?: Record<string, string>;
  variants?: Record<string, string>;
}

export const MediaSchema: IUnifiedModel<IMedia> = {
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
    media: IUnifiedController<IMedia>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('Media', MediaSchema);

  app.media = createUnifiedController<IMedia>('Media', MediaSchema);


  // app.addAction({
  //   template: 'list',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'count',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'retrieve',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'create',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'update',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'replace',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

  // app.addAction({
  //   template: 'delete',
  //   controller: app.media,
  //   pathPrefix: '/media',
  // });

}