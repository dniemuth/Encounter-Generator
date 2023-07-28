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
import {
  PROMPT_ENDING,
  PROMPT_EXAMPLE,
  PROMPT_INTRO,
  PAYLOAD,
  STORY_INTRO,
} from "~/utils/promptants";
import { createMessage, createStoryPrompt } from "~/utils/helpers";
// import { PAYLOAD, STORY_INTRO } from "~/utils/promptants";
// import { createStoryPrompt } from "~/utils/helpers";
import type { IQuestionaire } from "~/utils/types";
// import temp from "~/utils/encounter.json";

export const EncounterContext = createContextId<{
  dataFetching: boolean;
  dataStream: string;
  data: string;
  story: string;
}>("io.encounterbuilder.context");

export const useSubmitPrompt = routeAction$(
  async (item: IQuestionaire) => {
    const {useGPT} = item;
    console.log({useGPT});
    console.log(item)
    const APIKEY = useGPT
      ? process.env["GPT_APIKEY"] ?? ""
      : process.env["PALM_APIKEY"] ?? "";
    const basePath = useGPT
      ? "https://api.openai.com/v1/chat/completions"
      : "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
    const headers = {
      "Content-Type": "application/json",
      ...(useGPT
        ? { Authorization: `Bearer ${APIKEY}` }
        : { "x-goog-api-key": APIKEY }),
    };
    const userPrompts = createMessage(item);
    const messageContent = `${PROMPT_INTRO} ${userPrompts} ${PROMPT_ENDING}${PROMPT_EXAMPLE}`;
    const body = useGPT
      ? { ...PAYLOAD, messages: [{ role: "user", content: messageContent }] }
      : {
          prompt: {
            text: messageContent,
          },
          temperature: 1.0,
          candidate_count: 3,
        };
    console.info(JSON.stringify(body));
    const res = await fetch(basePath, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await res.json();
    console.info(result);
    // const res = { ok: true, status: "200" };
    // const result = {
    //   choices: [{ message: { content: JSON.stringify(temp) } }],
    // };
    return { ok: res.ok, status: res.status, result };
  },
  zod$({
    cr: z.string(),
    size: z.string(),
    type: z.string(),
    text: z.string(),
    useGPT: z.string().optional()
  })
);

export const useGetStory = routeAction$(
  async (item) => {
    console.log(item.useGPT);

     const {useGPT} = item;
    console.log({useGPT});
    console.log(item)
    const APIKEY = useGPT
      ? process.env["GPT_APIKEY"] ?? ""
      : process.env["PALM_APIKEY"] ?? "";
    const basePath = useGPT
      ? "https://api.openai.com/v1/chat/completions"
      : "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
    const headers = {
      "Content-Type": "application/json",
      ...(useGPT
        ? { Authorization: `Bearer ${APIKEY}` }
        : { "x-goog-api-key": APIKEY }),
    };
    const storyPrompts = createStoryPrompt(item);
    const messageContent = `${STORY_INTRO} ${storyPrompts}`;
    const body = useGPT
      ? { ...PAYLOAD, messages: [{ role: "user", content: messageContent }] }
      : {
          prompt: {
            text: messageContent,
          },
          temperature: 1.0,
          candidate_count: 3,
        };

    const res = await fetch(basePath, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await res.json();
    console.info(result);
    return { ok: res.ok, status: res.status, result };
  },
  zod$({
    alignment: z.string().optional(),
    name: z.string().optional(),
    size: z.string().optional(),
    type: z.string().optional(),
    text: z.string().optional(),
    useGPT: z.boolean().optional(),
  })
);

export default component$(() => {
  const encounterStore = useStore<{
    dataFetching: boolean;
    dataStream: string;
    data: string;
    story: string;
  }>(
    {
      dataFetching: false,
      dataStream: "",
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
