import { IComment } from "../interfaces/comment.interface";
import { IFilter } from "../interfaces/filter.interface";

export const filterOutSameComment = (comments: IComment[]): IComment[] => {
  const holder: IFilter<IComment> = comments.reduce((prev, curr) => {
    if (prev[`${curr.username}_${curr.comment}`]) {
      var p = prev[`${curr.username}_${curr.comment}`];
      if (Date.parse(p.commentDate).valueOf > Date.parse(curr.commentDate).valueOf) {
        prev[`${curr.username}_${curr.comment}`] = curr;
      }
    } else {
      prev[`${curr.username}_${curr.comment}`] = curr;
    }
    return prev;
  }, {} as IFilter<IComment>);
  return Object.keys(holder).map(k => holder[k]);
}

export const filterOutOldRepetitions = (comments: IComment[]): IComment[] => {
  const filter = comments.reduce((prev, curr) => {
    prev[`${curr.username}_${curr.commentDate}`] = curr;
    return prev;
  }, {} as IFilter<IComment>);
  return Object.keys(filter).map(key => filter[key]);
}

const getDate = (date: string) => Date.parse(date).valueOf();

export const getCorrectComments = (comments: IComment[]): IComment[] => {
  let correct = comments.filter(v => v.attached);
  correct = filterOutSameComment(correct);
  correct.sort((a, b) => getDate(a.commentDate) > getDate(a.commentDate) ? 1 : -1);
  return correct;
}

export const getTopCommenters = (comments:IComment[]) => {
  const o = comments.reduce((prev,curr) => {
    const u = curr.username;
    if(prev[u] !== undefined){
      prev[u] = 1+prev[u]; 
    }else{
      prev[u] = 1;
    }
    return prev
  },{} as IFilter<number>);
  const topCommenters = Object.keys(o).map(k => ({name:k, value:o[k]}));
  topCommenters.sort((a,b) => a.value > b.value ? -1:1);
  return topCommenters;
}

export const getTopAttached = (comments:IComment[]) => {
  const o = comments.reduce((prev,curr) => {
    const a = curr.attached;
    if(!a) return prev;
    if(prev[a] !== undefined){
      prev[a] = 1+prev[a]; 
    }else{
      prev[a] = 1;
    }
    return prev
  },{} as IFilter<number>);
  const topAttached = Object.keys(o).map(k => ({name:k, value:o[k]}));
  topAttached.sort((a,b) => a.value > b.value ? -1:1);
  return topAttached;
}

