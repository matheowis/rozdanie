import fs = require("fs");
import readline = require("readline");
import { IComment } from "../interfaces/comment.interface";
import { getFromBetween } from "./getFromBetween";

export const processInputFiles = async (fileName: string): Promise<IComment[]> => {
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
    const comment = splitted.slice(5).join(',');
    let attached = getFromBetween(comment, '@', ' ') || getFromBetween(comment, '@', ',') || getFromBetween(comment, '@', '.') || undefined;

    holder.push({
      profilePictureUrl,
      profileUrl,
      username,
      commentDate,
      likeCount: parseInt(likeCount),
      comment,
      attached
    });

  }

  return holder;
}