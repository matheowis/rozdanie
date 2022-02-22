import { IAvatarImage } from "../interfaces/IAvatarImage.interface";
import { IComment } from "../interfaces/IComment.interface";
import { drawAvatars } from "./drawAvatar";
import { getRandomCoords } from './getRandomCoord';
import {
  SIZE,
  IN_ROW,
  SPREAD,
  AVATARS_PER_TEX,
  PADDING,
  SECTION_SIZE,
} from '../constants/main.constants';
import { promiseProgress } from "./promiseProgress";

console.log('Avatars per texture is', AVATARS_PER_TEX);

export const createAvatarImages = async (comments: IComment[],callback?:(prog:number) => any): Promise<IAvatarImage[]> => {
  const maxComments = comments.length - (comments.length % AVATARS_PER_TEX);
  const filteredComments = comments.slice(0, maxComments);

  const avatarImages: IAvatarImage[] = [];

  const promises: Promise<IAvatarImage>[] = [];

  for (var i = 0; i < filteredComments.length; i += AVATARS_PER_TEX) {
    const currentComments = filteredComments.slice(i, i + AVATARS_PER_TEX);
    const avatarComments = getRandomCoords(currentComments, IN_ROW, SPREAD);
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    promises.push(drawAvatars(canvas, avatarComments, IN_ROW, PADDING));


    avatarImages.push({ comments: avatarComments, image: canvas, sectionSize: SECTION_SIZE, })
  }

  return promiseProgress(promises, (took, done) => {
    if (done % 10 === 0 || done === promises.length) {
      console.log(`done ${done}/${promises.length}, took ${(took / 1000).toFixed(2)}s`);
      callback?.(done/promises.length * 100);
    }
  });
}


// const _getAvatarImages = () => 