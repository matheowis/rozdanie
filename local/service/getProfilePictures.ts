import fs = require('fs');
import https = require('https');
import { IComment } from '../interfaces/comment.interface';
import { IFilter } from '../interfaces/filter.interface';

const getAndSaveImg = (url: string, name: string) => new Promise<{ user: string, data: string }>((resolve, reject) => {
  console.log('witeStream');
  const file = fs.createWriteStream(`${__dirname}/../images/${name}.png`);
  console.log('getImage');
  https.get(url, function (response) {
    console.log('save image');
    response.pipe(file);
    // response.setEncoding('base64');
    // var body = "data:" + response.headers["content-type"] + ";base64,";
    // response.on('data', data => {
    //   body += data;
    //   // console.log(body);
    //   resolve({ user: name, data: body });
    // });
    resolve({ user: name, data: '' })
  });
});

export const saveAllProfilePictures = async (comments: IComment[]) => {
  const o = comments.reduce((prev, curr) => {
    prev[curr.username] = curr.profilePictureUrl;
    return prev;
  }, {} as IFilter<string>)
  const promises = Object.keys(o).map(k => getAndSaveImg(o[k], k));
  const res = await Promise.all(promises);
  return res.reduce((prev,curr) => {
    prev[curr.user] = curr.data;
    return prev;
  },{} as IFilter<string>)
}


// export const getAndSaveImg = (comment) => {

//   const file = fs.createWriteStream(`${__dirname}/assets/${fileName}`);
//     https.get(url, function (response) {
//       response.pipe(file);
//       file.on('finish', () => {
//         console.log('saved file')
//         file.close(() => {
//           console.log('sending finished file')
//           res.sendFile(fileName, { root: __dirname + "/assets" });
//         });
//       });
//     });
// }

