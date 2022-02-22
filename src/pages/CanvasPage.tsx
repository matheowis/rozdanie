import * as React from 'react';
import { Button, makeStyles, CircularProgress } from '@material-ui/core';
// import { drawAvatar } from '../functions/drawAvatar';
// import { getRandomCoords } from '../functions/getRandomCoord';
import { IComment } from '../interfaces/IComment.interface';
import { createAvatarImages } from '../functions/createAvatarImages';
import { SIZE } from '../constants/main.constants';
import { lerp } from '../utils/calc';
import { saveData } from '../functions/saveData';
import { IAvatarImage } from '../interfaces/IAvatarImage.interface';
import { getParticipants } from '../service/getParticipants';

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

  },
  container: {
    position: 'relative',
    width: SIZE,
    height: SIZE,
    overflow: 'hidden',
  }
}));

// const CANV_SIZE = 1024;

const testObjs: IComment[] = new Array(20000).fill(0).map(_ => ({
  comment: 'test comment',
  commentDate: '1',
  likeCount: 0,
  profilePictureUrl: 'ja.jpg',
  profileUrl: 't',
  username: 'matheowis',
}));

const CanvasPage = () => {
  // const canvRef = React.createRef<HTMLCanvasElement>();
  const containerRef = React.createRef<HTMLDivElement>();
  const [loaded, setLoaded] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [avatars, setAvatars] = React.useState<IAvatarImage[]>();
  const cs = useStyles();

  React.useEffect(() => {
    console.log('START');
    handleImages();
    // console.log('start')

    // fetch('meta', {
    //   method: 'GET'
    // }).then(res => res.json()).then(res2 => console.log(res2));
    // const container = containerRef.current;
    // if (!container) return;

    // const avatarImages = createAvatarImages(testObjs);

    // const start = Date.now();
    // avatarImages.forEach(avatarImage => {
    //   const canvToAdd = avatarImage.image;
    //   const x = lerp(-128, 128, Math.random());
    //   const y = lerp(-128, 128, Math.random());
    //   canvToAdd.style.position = 'absolute';
    //   canvToAdd.style.left = `${x}px`;
    //   canvToAdd.style.bottom = `${y}px`;
    //   // container.append(canvToAdd);
    // });


    // setTimeout(() => {
    //   console.log(`texture creation too ${((Date.now() - 2000 - start) / 1000).toFixed(2)}s`,avatarImages.length)
    //   console.log('timeout');
    //   console.log(avatarImages[55].imgData);
    // }, 2000);
    // container.append(avatarImages[0].image);
  }, [])

  const handleImages = async () => {
    const container = containerRef.current;

    const participantsRaw = await getParticipants();
    const participants =[
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
      ...participantsRaw,
    ]


    console.log('START');
    const start = Date.now();
    const avatarImages = await createAvatarImages(participants, p => setProgress(p));

    avatarImages.forEach(avatarImage => {
      const canvToAdd = avatarImage.image;
      const x = lerp(-128, 128, Math.random());
      const y = lerp(-128, 128, Math.random());
      canvToAdd.style.position = 'absolute';
      canvToAdd.style.left = `${x}px`;
      canvToAdd.style.bottom = `${y}px`;
      container?.append(canvToAdd);
    });

    console.log(`FinishedIn ${((Date.now() - start) / 1000).toFixed(2)}s`);
    setLoaded(true);
    setAvatars(avatarImages);

  }

  return (
    <div className={cs.root}>
      <div
        className={cs.inner}>
        <div
          className={cs.container}
          ref={containerRef}
        >
          {/* {loaded ?
          <Button variant='contained' color='primary' onClick={() => saveData(avatars)}>Get Images</Button> :
          <CircularProgress variant="determinate" size={100} value={progress} />
        } */}
        </div>
      </div>
    </div>
  )
}

export default CanvasPage;