import fs = require('fs')

import { commentsByName, filterOutOldRepetitions, getCorrectComments, getDate, getTopCommenters } from './utils/filters';
import { processInputFiles } from './utils/processInputFiles';
import { saveAllProfilePictures } from './service/getProfilePictures';
import { IComment } from './interfaces/comment.interface';
import { IInvalidComment, IInvalidCommentsMap, IStat } from './interfaces/stat.interace';
import { IFilter } from './interfaces/filter.interface';


const processAllFiles = async () => {
  const allFiles = fs.readdirSync(__dirname + '/input').filter(v => v.startsWith('filtered_result'));
  const paths = allFiles.map(v => __dirname + '/input/' + v);
  const promisses = paths.map(fileName => processInputFiles(fileName));
  const results = await Promise.all(promisses);
  const allComments = filterOutOldRepetitions(results.flat());
  let incorrectComments: IInvalidCommentsMap = {};
  const correctComments = getCorrectComments(allComments, (v) => incorrectComments = v);

  // const commentsByName : IFilter<IComment[]> = correctComments.reduce((prev,curr) => {
  //   const key = curr.username;
  //   if(prev[key]){
  //     prev[key] = [curr];
  //   }else{
  //     prev[key] = [curr];
  //   }
  //   return prev;
  // },{} as IFilter<IComment[]>)
  const commentsMap = commentsByName(correctComments);
  // console.log('users=', Object.keys(commentsMap))
  // console.log(incorrectComments);
  const mainStats = allComments.reduce((prev, curr) => {
    const key = curr.username;
    const date: string = curr.commentDate.split('T')[0] || 'err';

    if (prev[key]) {
      const prevDate = prev[key].commentsPerDay[date] || 0;

      prev[key] = {
        ...prev[key],
        commentsPerDay: {
          ...prev[key].commentsPerDay,
          [date]: prevDate + 1,
        },
      }
    } else {
      const incComms = incorrectComments[key] || [];
      prev[key] = {
        imageURL:curr.profilePictureUrl,
        invalidComments: incComms,
        duplicates: incComms.map(v => v.type === 'duplicate' ? v.comment.length : 0).reduce((p, c) => p += c, 0),
        commentsPerDay: { [date]: 1 },
        responseTime: commentsMap[key]?.reduce((prevTime, curr, index) => {
          const currDateTime = getDate(curr.commentDate);
          if (index === 0) return currDateTime;
          const currTime = currDateTime - prevTime;
          return prevTime < currTime ? prevTime : currTime
        }, 100000000000),
        // minimalTimeBetweenInMS:0 ,
        validComments: commentsMap[key]?.length
      }
    }
    return prev;
  }, {} as IStat);


  // const stats = incorrectComments.reduce((prev,curr) => {

  // },{} as IStat)

  const imagesMap = await saveAllProfilePictures(correctComments);

  // const commentsToSave = correctComments.map(v => `${v.username}: @${v.attached}`).join('\n');
  const commentsToSave = correctComments.map(v => `${v.username}`).join('\n');
  // const incorrectCommentsToSave = incorrectComments.map(v => `${v.username}: ${v.comment}`).join('\n');

  const topComenters = getTopCommenters(allComments);
  const topComentersToSave = topComenters.map(v => `${v.name}= ${v.value}`).join("\n");
  let all = 0;
  topComenters.forEach(v => all += v.value);
  console.log(`all= ${all}`);

  const participantsToSave = correctComments.map(v => ({
    comment: v.comment,
    commentDate: v.commentDate,
    username: v.username,
    profileUrl: v.profileUrl,
    profilePictureUrl: `${v.username}.png`,
    likeCount: v.likeCount,
  }));

  fs.writeFileSync(__dirname + '/output/commentsToPrint.txt', commentsToSave);

  // fs.writeFileSync(__dirname + '/output/incorrectComments.txt', incorrectCommentsToSave);
  fs.writeFileSync(__dirname + '/output/stats.json', JSON.stringify(mainStats, undefined, 1));
  fs.writeFileSync(__dirname + '/output/participants.json', JSON.stringify(participantsToSave, undefined, 1));
}

processAllFiles();
