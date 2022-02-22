import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { IAvatarImage } from '../interfaces/IAvatarImage.interface';
import {
  metaParsedInterface,
  parsedIndexInterface,
  participantParsedInterface,
} from '../parsedInterfaces'
import { SIZE } from '../constants/main.constants';
// import { Z_PARTIAL_FLUSH } from 'zlib';

export const saveData = (data?: IAvatarImage[]) => {
  if (!data) throw ('NO DATA TO SAVE!');
  const zip = new JSZip();

  const AvatarPlanesFolder = zip.folder('Avatar planes');

  const imagesFolder = AvatarPlanesFolder?.folder("images");
  const jsonFolder = AvatarPlanesFolder?.folder("json");
  const interfacesFolder = AvatarPlanesFolder?.folder("interfaces");

  const imageBlobs = data.filter(v => v.blob).map((d, i) => ({
    blob: d.blob as Blob,
    name: `PLANE_${i}.png`
  }))

  imageBlobs.forEach(v => {
    imagesFolder?.file(v.name, v.blob);
  })

  const meta = data.map((d, i) => ({
    participant: d.comments.map(c => ({
      comment: c.comment,
      username: c.username,
      date: c.commentDate,
      likes: c.likeCount,
      picture: c.profilePictureUrl,
      x: c.x,
      y: c.y,
    })),
    planeAvatarSize: d.sectionSize / SIZE,
    planeName: `PLANE_${i}.png`
  }))

  const parsedJson = JSON.stringify(meta, undefined, 1);

  jsonFolder?.file('meta.json', parsedJson);
  interfacesFolder?.file('meta.interface.ts', metaParsedInterface);
  interfacesFolder?.file('participant.interface.ts', participantParsedInterface);
  interfacesFolder?.file('index.ts', parsedIndexInterface);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    FileSaver.saveAs(content, "Avatar planes.zip");
  });

}