import { IAvatarComment } from "./IAvatarComment.interface";

export interface IAvatarImage{
  comments:IAvatarComment[],
  image:HTMLCanvasElement,
  blob?:Blob,
  sectionSize:number,
}
