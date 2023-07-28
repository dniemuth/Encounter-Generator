// import { server$ } from '@builder.io/qwik-city';
// import type { IQuestionaire } from '~/utils/types';

export const streamStats = async function*(){
  // console.log(item);
  for (let i = 0; i < 10; i++) {
    yield i;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};