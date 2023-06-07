import { ResourceMaker } from 'resource-maker';
import type { IMediaBase, IMedia } from './interfaces.d.ts';


export const MediaMaker = new ResourceMaker<IMediaBase, IMedia>('Media');
