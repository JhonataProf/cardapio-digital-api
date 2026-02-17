export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export interface HttpRequest {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  pathParams?: any;
  user?: any;
  correlationId?: string;
}