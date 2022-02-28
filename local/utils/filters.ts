import { IComment } from "../interfaces/IComment.interface";
import { IInvalidComment, IInvalidCommentMap, IInvalidCommentsMap } from "../interfaces/stat.interace";
import { IFilter } from "../interfaces/IFilter.interface";

const getOlder = (a:IComment,b:IComment) => {
  return getDate(a.commentDate) <  getDate(b.commentDate)?a:b
}

const getNewer =  (a:IComment,b:IComment) => {
  return getDate(a.commentDate) >  getDate(b.commentDate)?a:b
}


export const filterOutSameComment = (
  comments: IComment[],
  storeInvalidComments: (inv: IInvalidCommentsMap) => any
): IComment[] => {
  const invalidCommentsPreview: IInvalidComment[] = [];
  const holder: IFilter<IComment> = comments.reduce((prev, curr) => {
    // I assume that user cant make multiple comments in one second
    if (!curr.attached) {
      invalidCommentsPreview.push({
        comment: [curr],
        firstSeen: curr,
        reason: `Brak podpiętej osoby`,
        type: 'noAttachment',
      })
      return prev;
    }
    const key = `${curr.username}_${curr.attached}`;
    if (prev[key]) {
      var p = prev[key];
      // keep oldest record
      if (Date.parse(p.commentDate).valueOf > Date.parse(curr.commentDate).valueOf) {
        prev[key] = curr;
      } else {
        invalidCommentsPreview.push({
          comment: [getNewer(curr,prev[key])],
          firstSeen: getOlder(curr,prev[key]),
          reason: `duplikat`,
          type: 'duplicate',
        })
      }
    } else {
      prev[key] = curr;
    }
    return prev;
  }, {} as IFilter<IComment>);

  const invWithCombinedDuplicaes:IInvalidCommentMap = invalidCommentsPreview.reduce((prev,curr) => {
    const key = `${curr.firstSeen.username}_${curr.firstSeen.attached}`;
    const nKey = `${curr.firstSeen.username}_${curr.firstSeen.commentDate}`;
    if(curr.type === 'noAttachment'){
      prev[nKey] = curr;
    }else{
      if(prev[key]){
        // const isFirstSeen = getDate(prev[key].firstSeen.commentDate) < getDate(curr.firstSeen.commentDate);
        // const firstSeen = isFirstSeen?prev[key].firstSeen:curr.firstSeen
        prev[key] = {
          ...prev[key],
          comment:[...prev[key].comment,...curr.comment],
          firstSeen:getOlder(prev[key].firstSeen, curr.firstSeen)
        };
      }else{
        prev[key] = curr;
      }
    }
    return prev;
  },{} as IInvalidCommentMap)

  const invalidComments = Object.keys(invWithCombinedDuplicaes).map(key => {
    const item = invWithCombinedDuplicaes[key];
    item.comment = item.comment.filter(v => v.commentDate !== item.firstSeen.commentDate);
    item.comment.sort((a, b) => getDate(a.commentDate) > getDate(b.commentDate) ? 1 : -1);
    return item;
  })

  const inv: IInvalidCommentsMap = invalidComments.reduce((prev, curr) => {
    const key = curr.firstSeen.username;
    if (prev[key]) {
      prev[key] = [...prev[key], curr];
    } else {
      prev[key] = [curr];
    }
    return prev;
  }, {} as IFilter<IInvalidComment[]>);

  
  
  storeInvalidComments(inv);
  return Object.keys(holder).map(k => holder[k]);
}

export const filterOutOldRepetitions = (comments: IComment[]): IComment[] => {
  const filter = comments.reduce((prev, curr) => {
    prev[`${curr.username}_${curr.commentDate}`] = curr;
    return prev;
  }, {} as IFilter<IComment>);
  return Object.keys(filter).map(key => filter[key]);
}

export const getDate = (date: string) => Date.parse(date).valueOf();

export const commentsByName = (comments:IComment[]) => {
  const sorted = [...comments];
  sorted.sort((a,b) => getDate(a.commentDate) > getDate(b.commentDate) ? -1:1);
  return sorted.reduce((prev,curr) => {
    const key = curr.username;
    if(prev[key]){
      prev[key] = [...prev[key], curr];
    }else{
      prev[key] = [curr];
    }
    return prev;
  },{} as IFilter<IComment[]>);
}

export const getCorrectComments = (comments: IComment[], incorrect: (incorrect: IInvalidCommentsMap) => any): IComment[] => {
  let correct = comments.filter(v => v.attached);
  let InvalidCommentsMap:IInvalidCommentsMap = {};
  console.log(`whith attached= ${correct.length}`);
  correct = filterOutSameComment(correct, incorrect);
  // correct = filterOutSameComment(correct, inv => InvalidCommentsMap = inv);
  
  // const invalidCommentsMap:IInvalidCommentsMap = Object.keys(tempInvalidCommentMap).map(key => {
  //   tempInvalidCommentMap[key].sort((a,b) => ])
  // });
  console.log(`unique comments= ${correct.length}`);
  correct.sort((a, b) => getDate(a.commentDate) > getDate(b.commentDate) ? 1 : -1);
  return correct;
}

export const getTopCommenters = (comments: IComment[]) => {
  const o = comments.reduce((prev, curr) => {
    const u = curr.username;
    if (prev[u] !== undefined) {
      prev[u] = 1 + prev[u];
    } else {
      prev[u] = 1;
    }
    return prev
  }, {} as IFilter<number>);
  const topCommenters = Object.keys(o).map(k => ({ name: k, value: o[k] }));
  topCommenters.sort((a, b) => a.value > b.value ? -1 : 1);
  return topCommenters;
}

export const getTopAttached = (comments: IComment[]) => {
  const o = comments.reduce((prev, curr) => {
    const a = curr.attached;
    if (!a) return prev;
    if (prev[a] !== undefined) {
      prev[a] = 1 + prev[a];
    } else {
      prev[a] = 1;
    }
    return prev
  }, {} as IFilter<number>);
  const topAttached = Object.keys(o).map(k => ({ name: k, value: o[k] }));
  topAttached.sort((a, b) => a.value > b.value ? -1 : 1);
  return topAttached;
}

