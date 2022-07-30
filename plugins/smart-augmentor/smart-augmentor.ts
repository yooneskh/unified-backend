
type GObject = Record<string, unknown>


export function smartAugment(source: GObject, target: GObject) {
  for (const key in target) {

    if (!( key in source ) || !source[key]) {
      source[key] = target[key];
      continue;
    }

    if (typeof source[key] !== 'object') {
      source[key] = target[key];
      continue;
    }

    // source[key] is either array or an object

    if (Array.isArray(source[key])) {
      if (Array.isArray(target[key])) {
        source[key] = [
          ...(source[key] as unknown[]),
          ...(target[key] as unknown[])
        ];
      }
      else {
        source[key] = [
          ...(source[key] as unknown[]),
          target[key]
        ];
      }
    }
    else {
      if (typeof target[key] === 'object' && !!target[key] && !Array.isArray(target[key])) {
        smartAugment(source[key] as GObject, target[key] as GObject)
      }
      else {
        source[key] = target[key];
      }
    }

  }
}
