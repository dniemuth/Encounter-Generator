export const PAYLOAD = {
  model: "gpt-3.5-turbo",
  // prompt: searched,
  temperature: 0.7,
  max_tokens: 2048,
  top_p: 1.0,
  frequency_penalty: 0.0,
  stream: false,
  presence_penalty: 0.0,
  n: 1,
};

export const PROMPT_INTRO = "Create a D&D creature stat block in JSON format.";
export const PROMPT_ENDING = `The JSON should include the following fields: 
- name: (string)
- type: (string)
- size: (string)
- alignment: (string)
- armorClass: (integer)
- hitPoints: (integer)
- speed: (object with fields: walk, swim, fly, climb, burrow)
- abilities: (object with fields: strength, dexterity, constitution, intelligence, wisdom, charisma)
- savingThrows: (array of strings)
- skills: (array of strings)
- damageResistances: (array of strings)
- damageImmunities: (array of strings)
- conditionImmunities: (array of strings)
- senses: (object with fields: passiveperception, darkvision, blindsight, tremorsense, truesight)
- languages: (array of strings)
- challengeRating: (decimal)
- specialAbilities: (array of objects with fields: name, description)
- actions: (array of objects with fields: name, description)
- reactions: (array of objects with fields: name, description)
- legendaryActions: (array of objects with fields: name, description, cost)

`;
export const PROMPT_EXAMPLE = `Example JSON format:
{
  "name": "Goblin",
  "type": "Humanoid",
  "size": "Small",
  "alignment": "Neutral Evil",
  "armorClass": 15,
  "hitPoints": 7,
  "speed": {
    "walk": 30
  },
  "abilities": {
    "strength": 8,
    "dexterity": 14,
    "constitution": 10,
    "intelligence": 10,
    "wisdom": 8,
    "charisma": 8
  },
  "savingThrows": ["dexterity", "constitution", "wisdom"],
  "skills": ["Stealth", "Athletics"],
  "damageResistances": [],
  "damageImmunities": [],
  "conditionImmunities": [],
  "senses": {
    "passiveperception": 9,
    "darkvision": 60
  },
  "languages": ["Common", "Goblin"],
  "challengeRating": 0.25,
  "specialAbilities": [
    {
      "name": "Nimble Escape",
      "description": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
    }
  ],
  "actions": [
    {
      "name": "Scimitar",
      "description": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
    },
    {
      "name": "Shortbow",
      "description": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
    }
  ],
  "reactions": [],
  "legendaryActions": []
}`;