import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { EncounterContext, useSubmitPrompt } from "~/routes";
import { CHALLENGE_RATINGS, CREATURE_TYPES, SIZES } from "~/utils/constants";

export const Questionaire = component$(() => {
  const encounterStore = useContext<{ data: string }>(EncounterContext);
  const action = useSubmitPrompt();

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
      <Form action={action} spaReset>
        <label for="size">Size:</label>
        <select
          id="size"
          name="size"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option value="">Any</option>
          {SIZES.map((size) => (
            <option value={size}>{`${size}`}</option>
          ))}
        </select>

        <label for="type">Type:</label>
        <select
          id="type"
          name="type"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option value="">Any</option>
          {CREATURE_TYPES.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>

        <label for="cr">Challenge Rating:</label>
        <select
          id="cr"
          name="cr"
          class="bg-slate-800 text-gray-300 w-full p-2 mb-4"
        >
          <option value="">Any</option>
          {CHALLENGE_RATINGS.map((cr) => (
            <option value={cr}>{`${cr}`}</option>
          ))}
        </select>

        <label for="text">Extra Details:</label>
        <textarea
          id="text"
          name="text"
          class="bg-slate-800 text-gray-300 w-full h-40 mb-4"
        />

        <button
          class="ring-2 ring-green-400 px-4 py-1 rounded-full text-green-400"
          type="submit"
        >
          Add item
        </button>
      </Form>
      <br />

      {console.log(action.formData, action.value)}
      {action.value?.ok ? (
        <p>{action.value?.result?.choices[0]?.message?.content}</p>
      ) : null}
    </>
  );
});
