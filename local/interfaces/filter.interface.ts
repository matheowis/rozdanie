import { IComment } from "./comment.interface";

export interface IFilter<T>{
  [key:string]:T
}