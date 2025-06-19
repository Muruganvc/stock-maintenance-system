import { IProductTypeResponse } from "./IProductTypeRequest";

export interface ApiResponse<T> {
  map(arg0: (a: any) => IProductTypeResponse): import("./IProductTypeRequest").IProductTypeResponse[];
  message: string;
  data: T;
}