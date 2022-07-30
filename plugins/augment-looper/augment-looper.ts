import { smartAugment } from '../smart-augmentor/smart-augmentor.ts';


export type Augmentor<T> = (object: T) => Partial<T> | void;

export class AugmentLooper<T> {

  private augmentors: Augmentor<T>[] = [];

  constructor(private maxAugmentCount = 100) {

  }

  public addAugmentor(augmentor: Augmentor<T>) {
    this.augmentors.push(augmentor);
  }

  public augment(object: T) {

    let augmentCount = 0;

    while (true) {

      let hadAugment = false;

      for (const augmentor of this.augmentors) {

        const augment = augmentor(object);
        if (!augment) continue;

        smartAugment(object as Record<string, unknown>, augment);

        augmentCount++;
        hadAugment = true;

        if (augmentCount >= this.maxAugmentCount) {
          throw new Error('augment loop detected.');
        }

      }

      if (!hadAugment) break;

    }

  }

}
