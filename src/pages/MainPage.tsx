import * as React from 'react';
import { getUczestniczki } from '../service/getUczestniczki';
import { RefreshRounded } from '@material-ui/icons';
import { IconButton, Typography, Button } from '@material-ui/core';
import { lerp } from '../utils/calc';
import { grey } from '@material-ui/core/colors';
import Center from '../Center';

interface IWinner {
  name: string
  url: string
  comment: string
}

const MainPage = () => {
  const [competitors, setCompetitors] = React.useState<string[][]>();
  const [winner, setWinner] = React.useState<IWinner>();

  React.useEffect(() => {
    getUczestniczki().then(comp => setCompetitors(comp));
  }, [])

  const getRandomCompetitor = () => {
    if (competitors) {
      const compId = Math.floor(lerp(0, competitors.length, Math.random()))
      const [url, comment] = competitors[compId];
      console.log({ url, comment })
      const urlSplit = url.split('/')
      setWinner({
        url,
        comment,
        name: urlSplit[urlSplit.length - 1]
      })
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
          {
            !competitors ?
              <Typography>Ładowanie uczestniczek</Typography>
              :
              !winner ?
                <IconButton onClick={getRandomCompetitor} color='primary'>
                  <RefreshRounded />
                </IconButton>
                :
                <div>
                  <Typography style={{ fontSize: 22, textAlign: 'center' }}>@{winner.name}</Typography>
                  <Typography style={{ fontSize: 14, color: grey[500], textAlign: 'center' }}>{winner.comment}</Typography>
                  <Center>
                    <Button href={winner.url} target="_blank" style={{ margin: 24 }} variant='contained' color='primary'>Profil</Button>
                  </Center>
                  <Center>
                    <IconButton onClick={getRandomCompetitor} color='primary'>
                      <RefreshRounded />
                    </IconButton>
                  </Center>
                </div>
          }
        </div>
      </div>
    </div>
  )
}

export default MainPage