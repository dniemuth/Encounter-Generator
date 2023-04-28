import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { EncounterContext, useSubmitPrompt, useGetStory } from "~/routes";
import { CHALLENGE_RATINGS, CREATURE_TYPES, SIZES } from "~/utils/constants";
import { isJsonString } from "~/utils/helpers";
import type { IStatBlock } from "~/utils/types";

export const Questionaire = component$(() => {
  const encounterStore = useContext<{ data: string; story: string }>(
    EncounterContext
  );
  const action = useSubmitPrompt();
  const getStory = useGetStory();

  useTask$(({ track }) => {
    track(() => action.value);
    if (action.value?.ok) {
      encounterStore.data =
        action.value?.result?.choices[0]?.message?.content ?? "";
    }
  });

  return (
    <>
      <h1 class="text-3xl text-center mb-6">Build Your Encounter</h1>
      <Form action={action}>
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
          class="ring-2 ring-green-400 px-4 py-1 rounded-full text-green-400"
          type="submit"
        >
          Add item
        </button>
      </Form>
      <button
        class="ring-2 ring-green-400 px-4 py-1 rounded-full text-green-400"
        onClick$={async () => {
          const encounter: IStatBlock = isJsonString(encounterStore.data)
            ? JSON.parse(encounterStore.data)
            : {};
          const description = (
            document.getElementById("text") as HTMLInputElement
          )?.value;
          const { value } = await getStory.submit({
            alignment: encounter?.alignment,
            name: encounter?.name,
            type: encounter?.type,
            size: encounter?.size,
            text: description,
          });
          console.log(value);
          encounterStore.story = value.result?.choices[0]?.message?.content;
        }}
      >
        Generate Story
      </button>
      <br />

      {console.log(action.formData, action.value)}
      {console.log(action.formData?.get('tags'))}
      {action.value?.ok ? (
        <p>{action.value?.result?.choices[0]?.message?.content}</p>
      ) : null}
    </>
  );
});
