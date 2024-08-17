

export class ResponseError extends Error {
  public message = 'an error occured';
  public status = 400;
  public label = 'There was a problem. Please try again.';
}

export class NotFoundError extends ResponseError {
  public message = 'requested item was not found.'
  public status = 404;
  public label = 'Requested item was not found.'
}
