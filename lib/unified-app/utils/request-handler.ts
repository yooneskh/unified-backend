import { ResponseError } from 'unified-app';
import { IUnifiedAction, IUnifiedActionContext, IUnifiedApp } from '../interfaces.d.ts';


interface IActionPatterned extends IUnifiedAction {
  pattern: URLPattern;
}


export function makeRequestHandler(app: IUnifiedApp, actions: IUnifiedAction[]): Deno.ServeHandler {

  const patternedActions: IActionPatterned[] = actions.map(it => ({
    ...it,
    pattern: new URLPattern({ pathname: it.path }),
  }));


  return async (request, requestInfo) => {
    try {

      /* find route */
  
      const action = patternedActions.find(it =>
        it.method === request.method.toLowerCase() && it.pattern.test(request.url)
      );
  
      if (!action) {
        return new Response('path not found: ' + request.method.toLowerCase() + ' ' + URL.parse(request.url)?.pathname, {
          status: 404,
        });
      }
  
  
      /* extract context */
  
      const headers = Object.fromEntries(request.headers.entries());
      const params = action.pattern.exec(request.url)?.pathname?.groups ?? {};
      const query = Object.fromEntries(URL.parse(request.url)?.searchParams.entries() ?? []);
  
  
      let body;
  
      if (headers['content-type']?.includes('multipart/form-data')) {
        try {
          body = await request.formData();
        }
        catch {
          return new Response(`could not parse request body as multipart form data`, {
            status: 400,
          });
        }
      }
      else if (headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        try {
          body = Object.fromEntries( (await request.formData()).entries() );
        }
        catch {
          return new Response(`could not parse request body as url encoded form data`, {
            status: 400,
          });
        }
      }
      else {
  
        body = await request.text();
  
        if (headers['content-type']?.includes('application/json')) {
          try {
            body = JSON.parse(body);
          }
          catch {
            return new Response(`request indicated that content type is json but could not parse body as a json`, {
              status: 400,
            });
          }
        }
  
      }
  
  
      const context = {
        app,
        action,
        request,
        requestInfo,
        headers,
        params,
        query,
        body,
      } as unknown as IUnifiedActionContext;
  
  
      /* middlewares */
  
      for (const middleware of app.middlewares) {
        await middleware(context);
      }
  
      
      /* response */
  
      const response = await action.handler!(context);


      /* postwares */

      for (const postware of app.postwares) {
        await postware(context);
      }


      /* return response */
  
      if (response instanceof Response) {
        return response;
      }
  
      if (typeof response === 'object' || typeof response === 'undefined' || typeof response === 'boolean' || typeof response === 'number') {
        return Response.json(response);
      }
  
      return new Response(String(response));

    }
    catch (error) {
      if (error instanceof ResponseError) {

        console.error(error.message);

        return Response.json(
          {
            error: error.label,
          },
          {
            status: error.status,
          }
        );

      }
      else {
        return new Response(error?.message ?? 'an error occured', {
          status: 400,
        });
      }
    }
  };

}