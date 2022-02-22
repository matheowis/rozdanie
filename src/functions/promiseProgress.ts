export const promiseProgress = <T>(values: Promise<T>[], callback?: (took: number, done: number) => any): Promise<T[]> => new Promise<T[]>((resolve, reject) => {
  var result: T[] = [];
  const start = Date.now();
  let done = 0;
  values.forEach((v, i) => {
    v.then(res => {
      result[i] = res;
      done++;
      callback?.(Date.now() - start, done);
      if (done === values.length) {
        resolve(result);
      }
    });
  });
})

