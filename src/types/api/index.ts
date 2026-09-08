export interface Result<T = unknown> {
  status: string | number;
  message: string;
  data: T;
}

export enum ResultStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
