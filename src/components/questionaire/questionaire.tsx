import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Form, server$ } from "@builder.io/qwik-city";
import { EncounterContext, useSubmitPrompt, useGetStory } from "~/routes";
import { CHALLENGE_RATINGS, CREATURE_TYPES, SIZES } from "~/utils/constants";
import { createMessage, isJsonString } from "~/utils/helpers";
import {
  PAYLOAD,
  PROMPT_ENDING,
  PROMPT_EXAMPLE,
  PROMPT_INTRO,
} from "~/utils/promptants";
import type { IQuestionaire, IStatBlock } from "~/utils/types";
// import { statStream } from "~/api/functions";

export const config = {
  runtime: "edge",
};

export const statStream = server$(async function* (item: IQuestionaire) {
  const isGPT = true;
  const APIKEY = isGPT
    ? process.env["GPT_APIKEY"] ?? ""
    : process.env["PALM_APIKEY"] ?? "";
  const basePath = isGPT
    ? "https://api.openai.com/v1/chat/completions"
    : "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
  const headers = {
    "Content-Type": "application/json",
    // 'Content-Type': 'text/event-stream',
    "X-Content-Type-Options": "nosniff",
    ...(isGPT
      ? { Authorization: `Bearer ${APIKEY}` }
      : { "x-goog-api-key": APIKEY }),
  };
  const userPrompts = createMessage(item);
  const messageContent = `${PROMPT_INTRO} ${userPrompts} ${PROMPT_ENDING}${PROMPT_EXAMPLE}`;
  const messages = {
    messages: [{ role: "user", content: messageContent }],
  };
  const res = await fetch(basePath, {
    headers,
    method: "POST",
    body: JSON.stringify({ stream: true, ...PAYLOAD, ...messages }),
  });
  const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();
  let isReading = true;

  while (isReading && reader) {
    const { value, done } = await reader.read();
    if (done) {
      isReading = false;
      yield { done: true, value: "" };
    } else {
      const lines = value.split("\n");
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, "").trim())
        .filter((line) => line !== "" && line !== "[DONE]")
        .map((line) => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        if (parsedLine) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            yield { done: false, value: content };
          }
        }
      }
    }
  }
});

const cleanPALMResponse = (output: string): string =>
  output.replace("```json", "").replace("```", "");

export const Questionaire = component$(() => {
  const encounterStore = useContext<{
    dataFetching: boolean;
    dataStream: string;
    data: string;
    story: string;
  }>(EncounterContext);
  const action = useSubmitPrompt();
  const getStory = useGetStory();
  const showStream = useSignal(false);

  useTask$(({ track }) => {
    track(() => action.value);
    if (action.value?.ok) {
      encounterStore.dataFetching = false;
      encounterStore.data =
        action.formData?.get("useGPT") === "on"
          ? action.value?.result?.choices[0]?.message?.content ?? ""
          : cleanPALMResponse(
              action.value?.result?.candidates[0]?.output ?? ""
            );
    }
  });

  return (
    <>
      <h1 class="text-3xl text-center mb-6">Build Your Encounter</h1>
      <Form action={action} id="form">
        <label
          for="useGPT"
          class="relative flex justify-between items-center text-lg"
        >
          Model:
          <input
            id="useGPT"
            name="useGPT"
            type="checkbox"
            class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
            onChange$={(e) => (showStream.value = e.target.checked)}
          />
          <span class="w-12 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out after:w-6 after:h-6 after:bg-white after:bg-[url('/bard-sparkle.gif')] after:bg-cover after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4 peer-checked:after:bg-[url('/openai-logo.png')] peer-checked:after:bg-green-400"></span>
        </label>
        <label for="size">Size:</label>
        <select
          id="size"
          name="size"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option selected={action.formData?.get("size") === ""} value="">
            Any
          </option>
          {SIZES.map((size) => (
            <option
              selected={action.formData?.get("size") === size}
              value={size}
            >{`${size}`}</option>
          ))}
        </select>

        <label for="type">Type:</label>
        <select
          id="type"
          name="type"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option selected={action.formData?.get("type") === ""} value="">
            Any
          </option>
          {CREATURE_TYPES.map((type) => (
            <option
              selected={action.formData?.get("type") === type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        <label for="cr">Challenge Rating:</label>
        <select
          id="cr"
          name="cr"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option selected={action.formData?.get("cr") === ""} value="">
            Any
          </option>
          {CHALLENGE_RATINGS.map((cr) => (
            <option
              selected={action.formData?.get("cr") === `${cr}`}
              value={cr}
            >{`${cr}`}</option>
          ))}
        </select>

        <label for="text">Extra Details:</label>
        <textarea
          id="text"
          name="text"
          class="bg-slate-800 text-gray-300 w-full h-40 mb-4"
        >
          {(action.formData?.get("text") ?? "") as unknown as undefined}
        </textarea>

        <button
          class="my-2 ring-2 ring-green-400 px-4 py-1 rounded-full text-green-400"
          type="submit"
          onClick$={() => {
            encounterStore.data = "";
            encounterStore.dataFetching = true;
          }}
        >
          Generate Stats
        </button>
        {/* {showStream.value && (
          <>
            <br />
            <button
              class="my-2 ring-2 ring-orange-400 px-4 py-1 rounded-full text-orange-400"
              onClick$={async () => {
                const form = document.getElementById("form") as HTMLFormElement;
                const formData = new FormData(form);
                const formDataObject = Object.fromEntries(formData.entries());
                const response = await statStream(formDataObject);
                if (response) {
                  // if( typeof encounterStore.data === 'number') {
                  encounterStore.dataStream = "";
                  encounterStore.data = "";
                  encounterStore.dataFetching = true;
                  for await (const data of response) {
                    // for (const data of [{done: false, value: ''}]) {
                    if (!data.done) encounterStore.dataStream += data.value;
                    else {
                      encounterStore.data = encounterStore.dataStream;
                      encounterStore.dataFetching = false;
                    }
                  }
                }
              }}
            >
              streaming
            </button>
          </>
        )} */}
      </Form>
      <button
        class="my-2 ring-2 ring-cyan-400 px-4 py-1 rounded-full text-cyan-400"
        onClick$={async () => {
          const encounter: IStatBlock = isJsonString(encounterStore.data)
            ? JSON.parse(encounterStore.data)
            : {};
          const description = (
            document.getElementById("text") as HTMLInputElement
          )?.value;
          const useGPT = (document.getElementById("useGPT") as HTMLInputElement)
            ?.checked;
          const { value } = await getStory.submit({
            alignment: encounter?.alignment,
            name: encounter?.name,
            type: encounter?.type,
            size: encounter?.size,
            text: description,
            useGPT: useGPT,
          });
          encounterStore.story = useGPT
            ? value.result?.choices[0]?.message?.content ?? ""
            : value?.result?.candidates[0]?.output ?? "";
        }}
      >
        Generate Story
      </button>
    </>
  );
});
