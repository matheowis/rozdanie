import { IComment } from "./IComment.interface";

export interface IFilter<T>{
  [key:string]:T
}