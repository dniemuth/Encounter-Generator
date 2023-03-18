import {
  component$,
  useStore,
  useContextProvider,
  createContextId,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Questionaire } from "~/components/questionaire/questionaire";
import { Encounter } from "~/components/encounter/encounter";

export const EncounterContext = createContextId<{ data: string[] }>(
  "io.encounterbuilder.context"
);

export default component$(() => {
  const encounterStore = useStore<{ data: string[] }>(
    {
      data: [],
    },
    { deep: true }
  );
  useContextProvider(EncounterContext, encounterStore);
  {console.log(process.env.DTEST)}
  {console.log(process.env.VITE_DTEST)}
  {console.log(import.meta.env.VITE_DTEST)}
  {console.log(import.meta.env.DTEST)}
  return (
    <div class="grid grid-cols-2">
      <div class="bg-slate-900 min-h-screen text-white p-6">
        <Questionaire />
      </div>
      <div class="p-6">
        <Encounter />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
