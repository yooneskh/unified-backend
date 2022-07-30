import { ResourceMaker } from '../../plugins/resource-maker/resource-maker.ts';
import type { IMediaBase, IMedia } from './interfaces.d.ts';


export const MediaMaker = new ResourceMaker<IMediaBase, IMedia>('Media');
