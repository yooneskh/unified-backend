import type { IUnifiedApp } from 'unified-app';


declare module 'unified-app' {
  interface IUnifiedActionContext {
    resourceId?: string;
    // deno-lint-ignore no-explicit-any
    filter?: any;
    sort?: Record<string, number>;
    select?: string[];
    populate?: Record<string, string>;
    limit?: number;
    skip?: number;
  }
}


export function install(app: IUnifiedApp) {
  
  app.addMiddleware(context => {

    if (context.params.resourceId !== undefined) {
      context.resourceId = context.params.resourceId;
    }

    if (context.query.filter) {
      context.filter = makeFilterFromQuery(context.query.filter);
    }
  
    if (context.query.sort) {
      context.sort = Object.fromEntries(
        context.query.sort.split(',').map(part => {
          const items = part.split(':');
          return [items[0], items[1] === '1' ? 1 : -1];
        })
      );
    }
  
    if (context.query.select) {
      context.select = context.query.select.split(' ');
    }

    if (context.query.populate) {
      context.populate = Object.fromEntries(
        context.query.populate.split(',').map(it =>
          it.split(':')
        )
      );
    }
  
    if (context.query.skip) {
      context.skip = parseInt(context.query.skip, 10);
    }
  
    if (context.query.limit) {
      context.limit = Math.min(parseInt(context.query.limit, 10), 30);
    }
  
  });

}


// deno-lint-ignore no-explicit-any
function applyOperatorOnFilter(filter: any, key: string, operator: string, value: any) {
  switch (operator) {
    case 'is':
      filter[key] = value;
      break;
    case 'neq':
      filter[key] = { $ne: value };
      break;
    case 'lt':
      filter[key] = { $lt: value };
      break;
    case 'lte':
      filter[key] = { $lte: value };
      break;
    case 'gt':
      filter[key] = { $gt: value };
      break;
    case 'gte':
      filter[key] = { $gte: value };
      break;
    case 'inc':
      filter[key] = { $regex: new RegExp(value, 'i') };
      break;
    case 'eq':
      filter[key] = { $eq: value }
      break;
    default: throw new Error(`filter invalid operator '${operator}'`);
  }
}

function makeFilterFromQuery(query: string) {
  if (!query) return {};

  // deno-lint-ignore no-explicit-any
  const result: any = {};
  const filtersParts = query.split(',');
  let orQuery = false;

  for (const part of filtersParts) {

    // deno-lint-ignore no-explicit-any
    let [key, operator, value]: any = part.split(':');

    if (key === '%or%' && operator === 'is' && value === '%true%') {
      orQuery = true;
      continue;
    }

    if (key === undefined) throw new Error(`filter invalid key '${key}'`);
    if (operator === undefined) throw new Error(`filter invalid operator '${operator}'`);
    if (value === undefined) throw new Error(`filter invalid value '${value}'`);

    if (value === '%true%') value = true;
    if (value === '%false%') value = false;
    if (value === '%null%') value = null;

    applyOperatorOnFilter(result, key, operator, value);

  }

  if (orQuery) {
    return {
      $or: Object.entries(result).map(entry =>
        ({ [entry[0]]: entry[1] })
      )
    }
  }

  return result;

}