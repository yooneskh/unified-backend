import { Config } from '../../config.ts';
import { IMedia } from './interfaces.d.ts';


export type IMediaTransform  = { method: string; payload: Record<string, unknown>; }[];

export async function transformMedia(media: IMedia, output: string, transform: IMediaTransform) {

  const payload = {
    input: `${Config.media.cwd}/${media.relativePath}`,
    output: `${Config.media.cwd}/${output}`,
    stages: transform
  };

  const response = await fetch('http://localhost:48503/process', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status !== 200) {
    throw new Error(`could not process image - ${await response.text()} - ${JSON.stringify(payload)}`);
  }

}
