import { plural } from 'deno_plural';
import type { IResourceBase } from './model.d.ts';
import type { IResourceActionContext, IResourceActionMultiFunction } from './router.d.ts';


export function makeCollectionName(name: string) {
  return plural(name).toLowerCase();
}


// deno-lint-ignore no-explicit-any
export async function executeActionMultiFunction<T, TF extends IResourceBase>(f: IResourceActionMultiFunction<T, TF>, context: IResourceActionContext<T, TF>): Promise<any> {
  if (typeof f === 'function') {
    return await f(context);
  }
  else if (Array.isArray(f)) {
    return await Promise.all(
      f.map(it => it(context))
    )
  }
  else {
    Object.fromEntries(
      await Promise.all(
        Object.entries(f).map(async entry =>
          [
            entry[0],
            await entry[1](context)
          ]
        )
      )
    )
  }
}
