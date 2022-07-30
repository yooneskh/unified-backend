import { IMedia } from './interfaces.d.ts';


export type IMediaValidator = (media: IMedia) => Promise<void> | void;

const mediaValidators: IMediaValidator[] = [];

export function registerMediaValidator(validator: IMediaValidator): void {
  mediaValidators.push(validator);
}

export function getMediaValidators(): IMediaValidator[] {
  return mediaValidators;
}


export type IMediaAddon = (media: IMedia) => Promise<void> | void;

const mediaAddons: IMediaAddon[] = [];

export function registerMediaAddon(addon: IMediaAddon): void {
  mediaAddons.push(addon);
}

export function getMediaAddons(): IMediaAddon[] {
  return mediaAddons;
}
