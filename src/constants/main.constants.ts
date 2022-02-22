export const SIZE = 1024;
// export const IN_ROW = 64;
export const IN_ROW = 128;
// export const SPREAD = 8;
export const SPREAD = 16;
export const AVATARS_PER_TEX = (IN_ROW/SPREAD)**2;
export const PADDING = 4;
export const SECTION_SIZE = (SIZE - 2*PADDING) / IN_ROW;

