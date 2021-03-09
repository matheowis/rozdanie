import { resolve } from "../../webpack.config"

const headers = {
  'Accept': '*/*',
  'Content-Type': 'application/json',
}

export const getUczestniczki = () => new Promise<string[][]>((resolve, reject) => {
  fetch(`${location.href}uczestniczki_raw.txt`, {
    method: 'GET',
    headers,
  }).then(res => res.text())
    .then(text => {
      const losy = text.split('\n').map(los => los.split(',').filter((v, i) => i < 2));
      losy.splice(0, 1);
      resolve(losy);
    }).catch(reject)
})

