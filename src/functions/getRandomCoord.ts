import { lerp } from "../utils/calc";

export const getRandomCoords = (size: number,spread = 2) => {
  // const tempSize = 16;
  const coords: { x: number, y: number }[] = [];

  let c = 0;

  for (var xi = 0; xi < size; xi += spread) {
    for (var yi = 0; yi < size; yi += spread) {
      let x =  Math.round(lerp(0, spread-1, Math.random()));
      // x = x >0 ? 1:0;
      let y = Math.round(lerp(0, spread-1, Math.random()));
      // y = y >0 ? 1:0;
      coords.push({ x: xi + x, y: yi + y });
      c++
    }
  }

  console.log("c=",c);

  return coords;
}