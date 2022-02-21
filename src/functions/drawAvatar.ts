export const drawAvatar = async (canvas: HTMLCanvasElement, x: number, y: number, inRow: number) => {
  const tmpCtx = canvas.getContext('2d');

  const img = document.createElement('img');


  const padding = 10;
  const size = (canvas.width - 2*padding) / inRow;

  img.src = "ja.jpg";
  img.onload = () => {
    if (!tmpCtx) return;
    var tmpCanvas2 = document.createElement('canvas');
    var tmpCtx2 = tmpCanvas2.getContext('2d');
    if(!tmpCtx2) return;

    

    tmpCtx2.save();
    tmpCtx2.beginPath();
    tmpCtx2.arc(75, 75, 75, 0, Math.PI * 2, true);
    tmpCtx2.closePath();
    tmpCtx2.clip();

    tmpCtx2.drawImage(img, 0, 0);

    tmpCtx2.beginPath();
    tmpCtx2.arc(0, 0, 25, 0, Math.PI * 2, true);
    tmpCtx2.clip();
    tmpCtx2.closePath();
    tmpCtx2.restore();


    tmpCtx.shadowOffsetX = 0;
    tmpCtx.shadowOffsetY = 0;
    tmpCtx.shadowColor = 'black';
    tmpCtx.shadowBlur = padding;

    tmpCtx.drawImage(tmpCanvas2, x * size + padding, y * size + padding, size*2, size);
    img.remove();
  }
}