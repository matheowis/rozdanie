import { IAvatarComment } from "../interfaces/IAvatarComment.interface";
import { IComment } from "../interfaces/IComment.interface";
import { lerp } from "../utils/calc";

export const getRandomCoords = (comments: IComment[], size: number, spread = 2): IAvatarComment[] => {
  let index = 0;
  const avatarComments: IAvatarComment[] = [];
  for (var xi = 0; xi < size; xi += spread) {
    for (var yi = 0; yi < size; yi += spread) {
      let x = Math.round(lerp(0, spread - 2, Math.random()));
      let y = Math.round(lerp(0, spread - 2, Math.random()));
      avatarComments.push({
        ...comments[avatarComments.length],
        x: xi + x,
        y: yi + y,
      })
      index++
    }
  }

  return avatarComments;
}

export const getTextureCoords = (comments: IComment[], size: number): IAvatarComment[] => {
  let index = 0;
  const avatarComments: IAvatarComment[] = [];
  for (var x = 0; x < size; x ++) {
    for (var y = 0; y < size; y ++) {
      if(!comments[avatarComments.length]) return avatarComments;
      avatarComments.push({
        ...comments[avatarComments.length],
        x,
        y,
      })
      index++
    }
  }

  return avatarComments;
}