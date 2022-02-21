import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { drawAvatar } from '../functions/drawAvatar';
import { getRandomCoords } from '../functions/getRandomCoord';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
    // width: window.innerWidth,
    // height: window.innerHeight,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: window.innerHeight,

  }
}));

const CANV_SIZE = 1024

const CanvasPage = () => {
  const canvRef = React.createRef<HTMLCanvasElement>();
  const cs = useStyles();

  React.useEffect(() => {
    const canv = canvRef.current



    if (!canv) return;

    const imagesInRow = 64;

    const coords = getRandomCoords(imagesInRow, 4);

    for (var i = 0; i < coords.length; i++) {
      drawAvatar(canv, coords[i].x, coords[i].y, imagesInRow);
    }



    // console.log(getRandomCoords(16));
    // const tmpCtx = canv.getContext('2d');


    // const img = document.createElement('img');
    // img.src = "https://instagram.fktw5-1.fna.fbcdn.net/v/t51.2885-19/s150x150/172292152_280633316880907_4455588468525876496_n.jpg?_nc_ht=instagram.fktw5-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=8vXbo-Z9pdQAX-CwWSm&edm=AIQHJ4wBAAAA&ccb=7-4&oh=00_AT97a_vpUN4_o0mcZfIJhCRo7IaONpVvqFT0bOsOvergRA&oe=621B5BAA&_nc_sid=7b02f1"
    // img.src = "ja.jpg"


    // img.onload = () => {
    //   if(!tmpCtx) return;
    // tmpCtx.save();
    // tmpCtx.beginPath();
    // tmpCtx.arc(25, 25, 25, 0, Math.PI * 2, true);
    // tmpCtx.closePath();
    // tmpCtx.clip();

    // tmpCtx.drawImage(img, 0, 0, 50, 50);

    // tmpCtx.beginPath();
    // tmpCtx.arc(0, 0, 25, 0, Math.PI * 2, true);
    // tmpCtx.clip();
    // tmpCtx.closePath();
    // tmpCtx.restore();

    // img.remove();
    // ctx?.drawImage(img,0,0,48,48);
    // }
  })

  return (
    <div className={cs.root}>
      <div className={cs.inner}>
        <canvas width={CANV_SIZE} height={CANV_SIZE} ref={canvRef} />
      </div>
    </div>
  )
}

export default CanvasPage;