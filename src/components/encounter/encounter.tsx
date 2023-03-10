import { component$, useContext } from "@builder.io/qwik";
import { EncounterContext } from "~/routes";

export const Encounter = component$(() => {
  const encounterData = useContext(EncounterContext);
  return (
    <>
      <ul>
        {encounterData.data.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </>
  );
});
