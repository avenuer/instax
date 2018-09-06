export enum StatusResponse {
  Success = 'Success',
  Failure = 'Failure'
}

export interface ResFormat<T> {
  data?: T;
  error?: string;
}

export interface ApiResponse<T> extends ResFormat<T> {
  statusCode: number;
  status: StatusResponse;
  time: number;
}

export function successFactory<T>(data: T): ApiResponse<T> {
  return {
    data,
    statusCode: 200,
    status: StatusResponse.Success,
    time: Date.now()
  };
}

export function failureFactory<T>(err: Error | string): ApiResponse<T> {
  err = typeof err === 'string' ? err : err.message;
  return {
    statusCode: 400,
    status: StatusResponse.Failure,
    error: err,
    time: Date.now()
  };
}
