import fs = require("fs");
import readline = require("readline");
import { IComment } from "../interfaces/IComment.interface";
import { IFollowers } from "../interfaces/IFollowers.interface";
import { getFromBetween } from "./getFromBetween";

export const processCommentFiles = async (fileName: string): Promise<IComment[]> => {
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const holder: IComment[] = [];

  for await (const line of rl) {
    if (line.startsWith('profilePictureUrl')) continue;
    const splitted = line.split(',');
    const [profilePictureUrl, profileUrl, username, commentDate, likeCount] = splitted;
    if (commentDate === '') continue;
    const comment = splitted.slice(5).join(',') + ' ';
    let attached = getFromBetween(comment, '@', ' ') || getFromBetween(comment, '@', ',') || getFromBetween(comment, '@', '.') || undefined;

    const date = new Date(commentDate)
    date.setTime(date.getTime() + (60 * 60 * 1000));
    holder.push({
      profilePictureUrl,
      profileUrl,
      username,
      commentDate: date.toISOString(),
      likeCount: parseInt(likeCount),
      comment,
      attached
    });

  }

  return holder;
}

export const processFollowersFiles = async (fileName: string[]): Promise<IFollowers> => {
  // return {};
  const holder: IFollowers = {};

  const fileStream = fs.createReadStream(fileName[0]);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    if (line.startsWith('query')) continue;
    const splitted = line.split(',');
    const [
      query,username,timestamp
    ] = splitted;
    if (query === '') continue;

    // if(timestamp === 'https://www.instagram.com/agnieszka.slowik.thelashroom'){
    //   console.log('splitted',splitted)
    // }
    // console.log(timestamp);

    const date = new Date(timestamp)
    date.setTime(date.getTime() + (60 * 60 * 1000));
    const splitQuery = query.split('/');
    const organizer = splitQuery[splitQuery.length - 1];
    if (holder[organizer]) {
      holder[organizer][username] = date.toISOString();
    } else {
      holder[organizer] = {
        [username]: date.toISOString(),
      }
    }
  }

  return holder;
}