import { component$, useContext } from "@builder.io/qwik";
import { EncounterContext } from "~/routes";
import type { IAbilities, ISenses, ISpeed, IStatBlock } from "~/utils/types";
import { EAbilities, ESenses } from "~/utils/constants";
import { displayCR, isJsonString, profCalc } from "~/utils/helpers";

export const Encounter = component$(() => {
  const encounterData = useContext(EncounterContext);
  const encounter: IStatBlock = isJsonString(encounterData.data)
    ? JSON.parse(encounterData.data)
    : {};
  const speedKeys = encounterData.data ? Object.keys(encounter?.speed) : [];
  const sensesKeys = encounterData.data ? Object.keys(encounter?.senses) : [];
  const centses = sensesKeys.map(
    (sense) =>
      `${ESenses[sense as keyof typeof ESenses]} ${
        encounter.senses[sense as keyof ISenses]
      }${
        ESenses[sense as keyof typeof ESenses] !== ESenses.passiveperception
          ? " ft"
          : ""
      }`
  );
  const abilityKeys = encounterData.data
    ? Object.keys(encounter?.abilities)
    : [];

  const pb = profCalc(encounter?.challengeRating);
  const saves =
    encounter?.savingThrows?.map(
      (save) =>
        `${EAbilities[save as keyof typeof EAbilities]} +${
          Math.floor(
            (encounter?.abilities[save as keyof IAbilities] - 10) / 2
          ) + pb
        }`
    ) ?? [];

  return (
    <>
      {encounterData.data && (
        <div>
          <h2 class="text-red-800 text-3xl">{encounter?.name}</h2>
          <p class="italic">
            {encounter?.size} {encounter.type}, {encounter.alignment}
          </p>
          <div class="py-4">
            <img src="/stat-block-header-bar.svg" />
          </div>
          <div class="text-red-800">
            <p>
              <span class="font-bold">Armor Class </span>
              {encounter?.armorClass}
            </p>
            <p>
              <span class="font-bold">Hit Points </span>
              {encounter?.hitPoints}
            </p>
            {speedKeys.map((key) => (
              <p>
                <span class="font-bold">
                  {key.charAt(0).toUpperCase()}
                  {key.slice(1)}ing Speed{" "}
                </span>
                {encounter?.speed[key as keyof ISpeed]}
              </p>
            ))}
          </div>
          <div class="py-4">
            <img src="/stat-block-header-bar.svg" />
          </div>
          <div class="flex text-red-800">
            {abilityKeys.map((ability) => (
              <div class="flex flex-1 flex-col items-center">
                <p class="font-bold">
                  {EAbilities[ability as keyof typeof EAbilities]}
                </p>
                <p>{encounter?.abilities[ability as keyof IAbilities]}</p>
              </div>
            ))}
          </div>
          <div class="py-4">
            <img src="/stat-block-header-bar.svg" />
          </div>
          <div class="text-red-800">
            {saves.length > 0 && (
              <p>
                <span class="font-bold">Saving Throws </span>
                {saves.join(", ")}
              </p>
            )}
            {encounter?.skills.length > 0 && (
              <p>
                <span class="font-bold">Skills </span>
                {encounter?.skills.join(", ")}
              </p>
            )}
            {encounter?.damageResistances.length > 0 && (
              <p>
                <span class="font-bold">Damage Resistances </span>
                {encounter?.damageResistances.join(", ")}
              </p>
            )}
            {encounter?.damageImmunities.length > 0 && (
              <p>
                <span class="font-bold">Damage Immunities </span>
                {encounter?.damageImmunities.join(", ")}
              </p>
            )}
            {encounter?.conditionImmunities.length > 0 && (
              <p>
                <span class="font-bold">Condition Immunities </span>
                {encounter?.conditionImmunities.join(", ")}
              </p>
            )}
            {centses.length > 0 && (
              <p>
                <span class="font-bold">Senses </span>
                {centses.join(", ")}
              </p>
            )}
            {encounter?.languages?.length > 0 && (
              <p>
                <span class="font-bold">Languages </span>
                {encounter?.languages.join(", ")}
              </p>
            )}
            {encounter?.challengeRating && (
              <p>
                <span class="font-bold">Challenge </span>
                {displayCR(encounter?.challengeRating)}
              </p>
            )}
            {pb && (
              <p>
                <span class="font-bold">Proficiency Bonus </span>+{pb}
              </p>
            )}
            <div class="py-4">
              <img src="/stat-block-header-bar.svg" />
            </div>
          </div>
          {encounter?.specialAbilities?.map((ability) => (
            <p class="mb-4">
              <span class="font-bold">{ability.name}.</span>{" "}
              <span>{ability.description}</span>
            </p>
          ))}
          <h3 class="text-red-800 text-2xl border-b-red-800 border-b mb-4 pb-1">
            Actions
          </h3>
          {encounter?.actions?.map((action) => (
            <p class="mb-4">
              <span class="font-bold">{action.name}.</span>{" "}
              <span>{action.description}</span>
            </p>
          ))}
          {encounter?.reactions?.length > 0 && (
            <>
              <h3 class="text-red-800 text-2xl border-b-red-800 border-b mb-4 pb-1">
                Reactions
              </h3>
              {encounter?.reactions?.map((reaction) => (
                <p class="mb-4">
                  <span class="font-bold">{reaction.name}.</span>{" "}
                  <span>{reaction.description}</span>
                </p>
              ))}
            </>
          )}
          {encounter?.legendaryActions?.length > 0 && (
            <>
              <h3 class="text-red-800 text-2xl border-b-red-800 border-b mb-4 pb-1">
                Legendary Actions
              </h3>
              {encounter?.legendaryActions?.map((legendary) => (
                <p class="mb-4">
                  <span class="font-bold">{legendary.name}.</span>{" "}
                  <span>{legendary.description}</span>
                </p>
              ))}
            </>
          )}
        </div>
      )}
      {encounterData?.story && (
        <div>
          {encounterData?.story}
        </div>
      )}
    </>
  );
});
