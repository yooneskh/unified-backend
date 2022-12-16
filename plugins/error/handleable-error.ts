

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


// export function handleNHttpError(error: unknown, rev: RequestEvent) {

  // if (error instanceof HandleableError) {
  //   if (error instanceof BypassRouteError) return;

  //   console.error(`Error :: ${error.message || error.defaultMessage}`);

  //   rev.response.header(error.headers);

  //   rev.response.status(error.httpStatus).json({
  //     code: error.code,
  //     message: error.responseMessage || error.defaultResponseMessage || error.message || error.defaultMessage,
  //     ...error.defaultData,
  //     ...error.data
  //   });

  // }
  // else {

  //   console.error(`Error :: ${error.message}`);

  //   rev.response.status(400).json({
  //     message: error.message
  //   });

  // }

// }
