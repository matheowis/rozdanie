import { SECTION_SIZE, SIZE } from "../constants/main.constants";
import { IAvatarComment } from "../interfaces/IAvatarComment.interface";
import { IAvatarImage } from "../interfaces/IAvatarImage.interface";
import { promiseProgress } from "./promiseProgress";
import {grey} from '@material-ui/core/colors'
// export const drawAvatar = async (canvas: HTMLCanvasElement, x: number, y: number, inRow: number) => {
//   const tmpCtx = canvas.getContext('2d');

//   const img = document.createElement('img');


//   const padding = 10;
//   const size = (canvas.width - 2 * padding) / inRow;

//   img.src = "ja.jpg";
//   img.onload = () => {
//     if (!tmpCtx) return;
//     var tmpCanvas2 = document.createElement('canvas');
//     var tmpCtx2 = tmpCanvas2.getContext('2d');
//     if (!tmpCtx2) return;



//     tmpCtx2.save();
//     tmpCtx2.beginPath();
//     tmpCtx2.arc(75, 75, 75, 0, Math.PI * 2, true);
//     tmpCtx2.closePath();
//     tmpCtx2.clip();

//     tmpCtx2.drawImage(img, 0, 0);

//     tmpCtx2.beginPath();
//     tmpCtx2.arc(0, 0, 25, 0, Math.PI * 2, true);
//     tmpCtx2.clip();
//     tmpCtx2.closePath();
//     tmpCtx2.restore();


//     tmpCtx.shadowOffsetX = 0;
//     tmpCtx.shadowOffsetY = 0;
//     tmpCtx.shadowColor = 'black';
//     tmpCtx.shadowBlur = padding;

//     tmpCtx.drawImage(tmpCanvas2, x * size + padding, y * size + padding, size * 2, size);
//     img.remove();
//   }
// }

// export const drawAvatars = async (canvas: HTMLCanvasElement, avatars: IAvatarComment[], inRow: number, padding: number) => {
//   const tmpCtx = canvas.getContext('2d');
//   let index = 0;

//   avatars.forEach(avatar => {
//     const img = document.createElement('img');
//     // const padding = 10;
//     const size = (canvas.width - 2 * padding) / inRow;
//     const { x, y } = avatar;
//     img.src = avatar.profilePictureUrl;
//     img.onload = () => {
//       var tmpCanvas2 = document.createElement('canvas');
//       var tmpCtx2 = tmpCanvas2.getContext('2d');
//       if (!tmpCtx || !tmpCtx2) return;


//       tmpCtx2.filter = 'blur(16px)';
//       tmpCtx2.save();
//       tmpCtx2.beginPath();
//       tmpCtx2.arc(75, 75, 75, 0, Math.PI * 2, true);
//       tmpCtx2.closePath();
//       tmpCtx2.clip();

//       tmpCtx2.drawImage(img, 0, 0);

//       tmpCtx2.beginPath();
//       tmpCtx2.arc(0, 0, 25, 0, Math.PI * 2, true);
//       tmpCtx2.clip();
//       tmpCtx2.closePath();
//       tmpCtx2.restore();


//       tmpCtx.shadowOffsetX = 0;
//       tmpCtx.shadowOffsetY = 0;
//       tmpCtx.shadowColor = 'black';
//       tmpCtx.shadowBlur = padding;

//       tmpCtx.drawImage(tmpCanvas2, x * size + padding, y * size + padding, size * 2, size);
//       img.remove();
//     }
//   })
// }

interface ICoordImage {
  img: HTMLImageElement,
  x: number,
  y: number,
}

const getCoordImage = (avatar: IAvatarComment) => new Promise<ICoordImage>((resolve, reject) => {
  const { profilePictureUrl: src, x, y } = avatar;
  const img = document.createElement('img');
  img.src = `images/${src}`;
  img.onload = () => {
    resolve({
      img, x, y
    });
  }
})

const canvToBlob = (canvas:HTMLCanvasElement) => new Promise<Blob>((resolve,reject) => {
  canvas.toBlob(blob => {
    if(blob){
      resolve(blob);
    }else{
      reject('error while creating blob from canvas')
    }
  })
})

export const drawAvatars = async (canvas: HTMLCanvasElement, avatars: IAvatarComment[], inRow: number, padding: number): Promise<IAvatarImage> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw ('Err');
  const coordImages = await Promise.all(avatars.map(avatar => getCoordImage(avatar)));

  coordImages.forEach(({ img, x, y }) => {
    const size = (canvas.width - 2 * padding) / inRow;
    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    if (!tmpCtx) throw ('Err');

    tmpCtx.filter = 'blur(4px)';
    tmpCtx.save();
    tmpCtx.beginPath();
    tmpCtx.arc(75, 75, 75, 0, Math.PI * 2, true);
    tmpCtx.closePath();
    tmpCtx.clip();

    tmpCtx.drawImage(img, 0, 0);

    tmpCtx.beginPath();
    tmpCtx.arc(0, 0, 25, 0, Math.PI * 2, true);
    tmpCtx.clip();
    tmpCtx.closePath();
    tmpCtx.restore();


    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = padding;

    ctx.drawImage(tmpCanvas, x * size + padding, y * size + padding, size * 2, size);
    img.remove();
  });

  const blob = await canvToBlob(canvas);

  return {
    comments: avatars,
    image: canvas,
    sectionSize: SECTION_SIZE,
    blob: blob,
  };
};