import { IComment } from "./comment.interface";

export type TInvalidCommentType = 'duplicate'|'noAttachment';

export interface IInvalidCommentMap{
  [key:string]:IInvalidComment
}
/// comment length is 1 if noAttachment or 2 if duplicate
export interface IInvalidCommentsMap{
  [key:string]:IInvalidComment[]
}

export interface IInvalidComment{
  type:TInvalidCommentType
  reason:string
  comment:IComment[]
  firstSeen:IComment
}

export interface IStat{
  [key:string]:{
    imageURL:string
    validComments:number,
    invalidComments:IInvalidComment[]
    responseTime:number, // check for hacking / fun
    duplicates:number,
    commentsPerDay:{
      [date:string]:number
    }
  }
}