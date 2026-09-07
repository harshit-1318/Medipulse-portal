export interface Result<T = any> {
  status: string | number;
  message: string;
  data: T;
}

export enum ResultStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
