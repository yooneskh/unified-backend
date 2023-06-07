import { ResourceMaker } from 'resource-maker';
import { makeFiltersFromQuery } from './util.ts';
// deno-lint-ignore no-unused-vars
import type { IResourceAction, IResourceActionContext } from 'resource-maker';
import { IResourceBase } from 'resource-maker';


declare module 'resource-maker' {

  interface IResourceAction<T, TF> {
    template?: 'list' | 'count' | 'retrieve' | 'create' | 'update' | 'delete';
  }

  interface IResourceActionContext<T, TF> {
    resourceId?: string;
    // deno-lint-ignore no-explicit-any
    filters?: any;
    selects?: string[];
    sorts?: Record<string, number>;
    populates?: Record<string, string>;
    skip?: number;
    limit?: number;
  }

}


ResourceMaker.addGlobalPreware(context => {

  const { queries, params } = context;

  if (params.resourceId) {
    context.resourceId = params.resourceId;
  }

  if (queries.filters) {
    context.filters = makeFiltersFromQuery(queries.filters);
  }

  if (queries.selects) {
    context.selects = queries.selects.split(' ');
  }

  if (queries.sorts) {
    context.sorts = Object.fromEntries(
      queries.sorts.split(',').map(part => {
        const items = part.split(':');
        return [items[0], items[1] === '1' ? 1 : -1];
      })
    );
  }

  if (queries.populates) {
    context.populates = Object.fromEntries(
      queries.populates.split(',').map(it =>
        it.split(':')
      )
    );
  }

  if (queries.skip) {
    context.skip = parseInt(queries.skip, 10);
  }

  if (queries.limit) {
    context.limit = Math.min(parseInt(queries.limit, 10), 30);
  }

});


ResourceMaker.addGlobalActionAugmentor(({ template, resourceName, signal, method, path, provider }) => {
  if (!template) return;

  const result: Partial<IResourceAction<unknown, IResourceBase>> = { template: undefined };

  switch (template) {

    case 'list': {

      if (!signal) result.signal = `Route.${resourceName}.List`;
      if (!method) result.method = 'get';
      if (!path) result.path = '/';

      if (!provider) {
        result.provider = ({ controller, queries, filters, selects, sorts, populates, skip, limit }) => {
          if (!queries.single) {
            return controller.list({
              filters,
              selects,
              sorts,
              populates,
              skip,
              limit
            });
          }
          else {
            return controller.retrieveBy({
              filters,
              selects,
              populates
            });
          }
        };
      }

    } break;

    case 'count': {

      if (!signal) result.signal = `Route.${resourceName}.Count`;
      if (!method) result.method = 'get';
      if (!path) result.path = '/count';

      if (!provider) {
        result.provider = ({ controller, filters }) => {
          return controller.count({ filters });
        };
      }

    } break;

    case 'retrieve': {

      if (!signal) result.signal = `Route.${resourceName}.Retrieve`;
      if (!method) result.method = 'get';
      if (!path) result.path = '/:resourceId';

      if (!provider) {
        result.provider = ({ controller, resourceId, selects, populates }) => {
          return controller.retrieve({
            resourceId,
            selects,
            populates
          });
        };
      }

    } break;

    case 'create': {

      if (!signal) result.signal = `Route.${resourceName}.Create`;
      if (!method) result.method = 'post';
      if (!path) result.path = '/';

      if (!provider) {
        result.provider = ({ controller, payload }) => {
          return controller.create({
            document: payload
          });
        };
      }

    } break;

    case 'update': {

      if (!signal) result.signal = `Route.${resourceName}.Update`;
      if (!method) result.method = 'post';
      if (!path) result.path = '/:resourceId/update';

      if (!provider) {
        result.provider = ({ controller, resourceId, payload }) => {
          return controller.update({
            resourceId,
            payload
          });
        };
      }

    } break;

    case 'delete': {

      if (!signal) result.signal = `Route.${resourceName}.Delete`;
      if (!method) result.method = 'delete';
      if (!path) result.path = '/:resourceId';

      if (!provider) {
        result.provider = ({ controller, resourceId }) => {
          return controller.delete({
            resourceId
          });
        };
      }

    } break;

    default: {
      throw new Error(`invalid template ${template}`);
    }

  }

  return result;

});
