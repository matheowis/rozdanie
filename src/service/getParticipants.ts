import {IComment} from '../interfaces/IComment.interface'

export const getParticipants = () => new Promise<IComment[]>((resolve,reject) => {
  fetch('meta', {
    method: 'GET'
  })
  .then(raw => raw.json())
  .then(res => resolve(res));
});
