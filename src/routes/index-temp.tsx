import {
  component$,
  useStore,
  useContextProvider,
  createContextId,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$, zod$, z } from "@builder.io/qwik-city";
import { Questionaire } from "~/components/questionaire/questionaire";
import { Encounter } from "~/components/encounter/encounter";
import { PROMPT_ENDING, PROMPT_EXAMPLE, PROMPT_INTRO, PAYLOAD, STORY_INTRO } from "~/utils/promptants";
import { createMessage, createStoryPrompt } from "~/utils/helpers";
// import { PAYLOAD, STORY_INTRO } from "~/utils/promptants";
// import { createStoryPrompt } from "~/utils/helpers";
import type { IQuestionaire } from "~/utils/types";
// import temp from "~/utils/encounter.json";

export const EncounterContext = createContextId<{
  data: string;
  story: string;
}>("io.encounterbuilder.context");

export const useSubmitPrompt = routeAction$(
  async (item: IQuestionaire) => {
    console.log(item);
    const APIKEY =  process.env['APIKEY'];
    const userPrompts = createMessage(item);
    const messageContent = `${PROMPT_INTRO} ${userPrompts} ${PROMPT_ENDING}${PROMPT_EXAMPLE}`;
    const messages = { messages: [{ role: "user", content: messageContent }] };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKEY}`,
      },
      method: "POST",
      body: JSON.stringify({ ...PAYLOAD, ...messages }),
    });
    // const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();
    // let isReading = true;
    // let chatterBot = '';

    // while(isReading && reader){
    //   const {value, done} = await reader.read();
    //   if(done) isReading = false;
    //   else {
    //     const chatData = value.slice(6);
    //     if(isJsonString(chatData)){
    //       const newVal = JSON.parse(value.slice(6)).choices[0].delta.content;
    //       // const newVal = Object(eval(value));
    //       chatterBot = `${chatterBot}${newVal}`;
    //       console.log('Received', chatterBot);
    //     }
    //   }
    // }
    const result = await res.json();
    // const res = { ok: true, status: "200" };
    // const result = {
    //   choices: [{ message: { content: JSON.stringify(temp) } }],
    // };
    return { ok: res.ok, status: res.status, result };
  }
  // ,
  // zod$({
  //   cr: z.string(),
  //   size: z.string(),
  //   type: z.string(),
  //   text: z.string(),
  // })
);

export const useGetStory = routeAction$(
  async (item) => {
    const APIKEY = process.env['APIKEY'];
    const storyPrompts = createStoryPrompt(item);
    const messageContent = `${STORY_INTRO} ${storyPrompts}`;
    const messages = { messages: [{ role: "user", content: messageContent }] };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKEY}`,
      },
      method: "POST",
      body: JSON.stringify({ ...PAYLOAD, ...messages }),
    });
    const result = await res.json();
    return { ok: res.ok, status: res.status, result };
  },
  zod$({
    alignment: z.string().optional(),
    name: z.string().optional(),
    size: z.string().optional(),
    type: z.string().optional(),
    text: z.string().optional(),
  })
);

export default component$(() => {
  const encounterStore = useStore<{ data: string; story: string }>(
    {
      data: "",
      story: "",
      // data: JSON.stringify(temp)
    },
    { deep: true }
  );
  useContextProvider(EncounterContext, encounterStore);
  return (
    <div class="grid grid-cols-3">
      <div class="bg-slate-900 min-h-screen text-white p-6">
        <Questionaire />
      </div>
      <div class="p-6 col-span-2">
        <Encounter />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Beast-AI-ry",
  meta: [
    {
      name: "description",
      content:
        "Generative beastiary, using AI to create your D&D 5E Encounters",
    },
  ],
};
