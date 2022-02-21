import fs = require('fs')
import { IComment } from './interfaces/comment.interface';

import { IFilter } from './interfaces/filter.interface';
import { filterOutOldRepetitions, filterOutSameComment, getCorrectComments, getTopCommenters } from './utils/filters';
import { processInputFiles } from './utils/processInputFiles';


const processAllFiles = async () => {
  const allFiles = fs.readdirSync(__dirname + '/input');
  const paths = allFiles.map(v => __dirname + '/input/' + v);
  const promisses = paths.map(fileName => processInputFiles(fileName));
  const results = await Promise.all(promisses);
  const allComments = filterOutOldRepetitions(results.flat());
  const correctComments = getCorrectComments(allComments);

  // const commentsToSave = correctComments.map(v => `${v.username}: @${v.attached}`).join('\n');
  const commentsToSave = correctComments.map(v => `${v.username}`).join('\n');

  const topComenters = getTopCommenters(allComments);
  const topComentersToSave = topComenters.map(v => `${v.name}=${v.value}`).join("\n");

  fs.writeFileSync(__dirname + '/output/commentsToPrint.txt', commentsToSave);
  fs.writeFileSync(__dirname + '/output/stats.txt', topComentersToSave);


  // Promise.all(promisses).then(r => {
  //   const filter = r.flat().reduce((prev, curr) => {
  //     prev[`${curr.username}_${curr.commentDate}`] = curr;
  //     return prev;
  //   }, {} as IFilter<IComment>);
  //   let all = Object.keys(filter)
  //     .map(key => filter[key])
  //     .filter(v => v.attached);

  //   all = filterOutSameComment(all);


  //   var test = all.map(v => ({name:`${v.username}: @${v.attached}`,time:Date.parse(v.commentDate).valueOf() }))
  //   test.sort((a, b) => a.time > b.time ? 1 : -1);
  //   var testText = test.map(v => v.name).join('\n');

  //   fs.writeFileSync(__dirname + '/output/test.txt', testText);


  // })
}

// console.log(getFromBetween('@fgh @ghj scj abc', '@', ' '));

processAllFiles();
