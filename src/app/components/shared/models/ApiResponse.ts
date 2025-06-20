export interface ApiResponse<T> {
  map(arg0: (x: any) => { label: any; value: any; }): unknown;
  message: string;
  data: T;
}