

export class HandleableError extends Error {

  public code = 1000;
  public httpStatus = 400;

  public defaultMessage = '';
  public defaultResponseMessage = '';
  public defaultData: Record<string, unknown> = {};

  constructor(public message = '', public responseMessage = '', public headers: Record<string, string> = {}, public data: Record<string, unknown> = {}) {
    super(message);
  }

}


export class NotFoundError extends HandleableError {
  public code = 1001;
  public httpStatus = 404;
  public defaultMessage = 'requested item was not found.';
  public defaultResponseMessage = 'مورد خواسته شده یافت نشد.';
}

export class BypassRouteError extends HandleableError {
  public code = 1002;
}


export function handleWebserverError(error: unknown) {

  if (error instanceof BypassRouteError) {
    return;
  }

  if (error instanceof HandleableError) {

    console.error(`Error :: ${error.message ?? error.defaultMessage}`);

    return new Response(
      JSON.stringify({
        code: error.code,
        message: error.responseMessage || error.defaultResponseMessage || error.message || error.defaultMessage,
        ...error.defaultData,
        ...error.data
      }),
      {
        status: error.httpStatus,
        headers: {
          'content-type': 'application/json',
          ...error.headers,
        },
      }
    );

  }


  console.error(`Error :: ${(error as Record<string, unknown>)?.message}`);

  return new Response(
    JSON.stringify({
      message: (error as Record<string, unknown>)?.message,
    }),
    {
      status: 400,
      headers: {
        'content-type': 'application/json',
      },
    }
  );

}
