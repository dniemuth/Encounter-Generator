import { fraction } from "mathjs";
import type { IQuestionaire, IStoryPrompts } from "./types";

export const profCalc = (cr: number) => cr === 0 ? 2 : Math.ceil(cr/4)+1;

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const displayCR = (num: number) => {
  const fract = fraction(num);
  return fract.d === 1 ? `${fract.n}` : `${fract.n}/${fract.d}`;
};

export const createMessage = (prompt: IQuestionaire) => {
  const cr = prompt.cr ? `Challenge Rating should be ${prompt.cr}. ` : '';
  const type = prompt.type ? `Type should be ${prompt.type}. ` : '';
  const size = prompt.size ? `Size should be ${prompt.size}. ` : '';
  return `${cr}${type}${size}${prompt.text}`;
}

export const createStoryPrompt = (prompt: IStoryPrompts) => {
  const name = prompt.name ? `The name of the character is ${prompt.name}. ` : '';
  const size = prompt.size ? `The size of the character is ${prompt.size}. ` : '';
  const type = prompt.type ? `The type of the character is ${prompt.type}. ` : '';
  const alignment = prompt.alignment ? `The alignment of the character is ${prompt.alignment}. ` : '';
  return `${name}${size}${type}${alignment}${prompt.text}`;
}
