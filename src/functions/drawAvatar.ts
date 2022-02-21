export const drawAvatar = async (canvas:HTMLCanvasElement,x:number,y:number,inRow:number) => {
  const tmpCtx = canvas.getContext('2d');

  const img = document.createElement('img');

  const size = canvas.width / inRow;

  img.src = "ja.jpg";
  img.onload = () => {
    if(!tmpCtx) return;
    tmpCtx.save();
    tmpCtx.beginPath();
    tmpCtx.arc(x*size + size/2, y*size + size/2, size/2, 0, Math.PI * 2, true);
    tmpCtx.closePath();
    tmpCtx.clip();

    tmpCtx.drawImage(img, x*size, y*size, size, size);

    tmpCtx.beginPath();
    tmpCtx.arc(0, 0, 25, 0, Math.PI * 2, true);
    tmpCtx.clip();
    tmpCtx.closePath();
    tmpCtx.restore();

    img.remove();
    // ctx?.drawImage(img,0,0,48,48);
  }
}