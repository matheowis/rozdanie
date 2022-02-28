import fs = require('fs')

import { commentsByName, filterOutOldRepetitions, getCorrectComments, getDate, getTopCommenters } from './utils/filters';
import { processCommentFiles, processFollowersFiles } from './utils/processInputFiles';
import { saveAllProfilePictures } from './service/getProfilePictures';
import { IComment } from './interfaces/IComment.interface';
import { IInvalidComment, IInvalidCommentsMap, IStat } from './interfaces/stat.interace';
import { IFilter } from './interfaces/IFilter.interface';


const processAllFiles = async () => {
  const allCommentsFiles = fs.readdirSync(__dirname + '/input').filter(v => v.startsWith('filtered_result')).map(v => __dirname + '/input/' + v);
  const allFollowersFiles = fs.readdirSync(__dirname + '/input').filter(v => v.startsWith('filtered_followers')).map(v => __dirname + '/input/' + v);
  // const commentsPath = allCommentsFiles.map(v => __dirname + '/input/' + v);
  // const followersPath = allFollowersFiles.map(v => __dirname + '/input/' + v);
  const commentsPromisses = allCommentsFiles.map(fileName => processCommentFiles(fileName));
  const followersResults = await processFollowersFiles(allFollowersFiles);
  const commentsResults = await Promise.all(commentsPromisses);
  const allComments = filterOutOldRepetitions(commentsResults.flat());
  let incorrectComments: IInvalidCommentsMap = {};
  const correctComments = getCorrectComments(allComments, (v) => incorrectComments = v);

  const commentsMap = commentsByName(correctComments);

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
        imageURL: curr.profilePictureUrl,
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




  // const imagesMap = await saveAllProfilePictures(correctComments);

  const commentsToSaveHolder = correctComments.map(v => `${v.username}`);
  commentsToSaveHolder.sort((a, b) => Math.random() > 0.5 ? -1 : 1);
  const commentsToSave = commentsToSaveHolder.join('\n');

  const tHolder = [...correctComments];
  tHolder.sort((a,b) => getDate(a.commentDate) < getDate(b.commentDate) ? -1:1);
  console.log('tHolder',tHolder[0]);

  const datedCommentsToSave:IFilter<string[]> = tHolder.map((v,i) => ({...v,username:`${i+1}. ${v.username}`})).reduce((prev,curr) => {
    const date = curr.commentDate.split('T')[0];
    if(prev[date]){
      prev[date] = [...prev[date],curr.username];
    }else{
      prev[date] = [curr.username];
    }
    return prev;
  },{} as IFilter<string[]>)



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
  fs.writeFileSync(__dirname + '/output/followers.json', JSON.stringify(followersResults, undefined, 1));
  fs.writeFileSync(__dirname + '/output/participants.json', JSON.stringify(participantsToSave, undefined, 1));
  Object.keys(datedCommentsToSave).forEach(key => {
    const [first,...rest] = datedCommentsToSave[key];
    const last = rest[rest.length-1];
    rest.splice(rest.length-1);
    rest.sort((a, b) => Math.random() > 0.5 ? -1 : 1);
    const datedComments = [first,...rest,last].join("\n");
    fs.writeFileSync(__dirname + `/output/datedComments_${key}.txt`, datedComments);
  })
}

processAllFiles();
