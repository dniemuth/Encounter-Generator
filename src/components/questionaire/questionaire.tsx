import { component$, useContext, useTask$ } from '@builder.io/qwik';
import { globalAction$, zod$, z, Form } from '@builder.io/qwik-city';
import { EncounterContext } from '~/routes';

export const useSubmitPrompt = globalAction$(
  (item) => {
    console.log(process.env.DTEST);
    console.log(process.env.VITE_DTEST);
    console.log(import.meta.env.DTEST);
    console.log('hellow')
    console.log(import.meta.env.VITE_DTEST);
    return {
      success: true,
      response: `Here lies the ecounter details ${item.text}`,
      item,
      pd: process.env.DTEST,
      pv: process.env.VITE_DTEST,
      id: import.meta.env.DTEST,
      iv: import.meta.env.VITE_DTEST
    };
  },
  zod$({
    text: z.string(),
  })
);

export const Questionaire = component$(() => {
  const encounterStore = useContext<{data: string[]}>(EncounterContext);
  const action = useSubmitPrompt();

  useTask$(({track}) => {
    track(() => action.value);
    if(action.value?.success) {
      encounterStore.data.push(action.value?.response ?? '');
    }
  })

  return (
    <>
      <h1 class="text-3xl text-center mb-6">Build Your Encounter</h1>
      <Form action={action} spaReset>
        <textarea name="text" class="bg-slate-800 text-gray-300 w-full h-40" required />
        <button type="submit">Add item</button>
      </Form>
      <br />

      {console.info(action.value)}
      {action.value?.success ? <p>{action.value?.response}</p> : null}
    </>
  );
});
