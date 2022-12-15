
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

export function makeFiltersFromQuery(query: string) {
  if (!query) return {};

  // deno-lint-ignore no-explicit-any
  const result: any = {};
  const filtersParts = query.split(',');
  let oredQueries = false;

  for (const part of filtersParts) {

    // deno-lint-ignore no-explicit-any
    let [key, operator, value]: any = part.split(':');

    if (key === '%or%' && operator === 'is' && value === '%true%') {
      oredQueries = true;
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

  if (oredQueries) {
    return {
      $or: Object.entries(result).map(entry =>
        ({ [entry[0]]: entry[1] })
      )
    }
  }

  return result;

}
