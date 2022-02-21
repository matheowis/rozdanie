import fs = require('fs')

import { filterOutOldRepetitions, getCorrectComments, getTopCommenters } from './utils/filters';
import { processInputFiles } from './utils/processInputFiles';
import { saveAllProfilePictures } from './service/getProfilePictures';


const processAllFiles = async () => {
  const allFiles = fs.readdirSync(__dirname + '/input');
  const paths = allFiles.map(v => __dirname + '/input/' + v);
  const promisses = paths.map(fileName => processInputFiles(fileName));
  const results = await Promise.all(promisses);
  const allComments = filterOutOldRepetitions(results.flat());
  const correctComments = getCorrectComments(allComments);

  const imagesMap = await saveAllProfilePictures(correctComments);

  // const commentsToSave = correctComments.map(v => `${v.username}: @${v.attached}`).join('\n');
  const commentsToSave = correctComments.map(v => `${v.username}`).join('\n');

  const topComenters = getTopCommenters(allComments);
  const topComentersToSave = topComenters.map(v => `${v.name}=${v.value}`).join("\n");

  fs.writeFileSync(__dirname + '/output/commentsToPrint.txt', commentsToSave);
  fs.writeFileSync(__dirname + '/output/stats.txt', topComentersToSave);
  fs.writeFileSync(__dirname + '/output/imagesMap.json', JSON.stringify(imagesMap, undefined, 1));

}

processAllFiles();
