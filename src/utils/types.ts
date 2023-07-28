export interface ISpeed {
  walk?: number,
  swim?: number,
  fly?: number,
  climb?: number,
  burrow?: number,
}

export interface IAbilities {
  strength: number,
  dexterity: number,
  constitution: number,
  intelligence: number,
  wisdom: number,
  charisma: number,
}

export interface ISavingThrows {
  strength?: number,
  dexterity?: number,
  constitution?: number,
  intelligence?: number,
  wisdom?: number,
  charisma?: number,
}

export interface ISenses {
  passiveperception?: number,
  blindSight?: number,
  darkvision?: number,
  tremorsense?: number,
  truesight?: number,
}

export interface IDetail {
  name: string,
  description: string,
}

export interface ICostDetail extends IDetail {
  cost: string,
}

export interface IStatBlock {
  name: string,
  type: string,
  size: string,
  alignment: string,
  armorClass: string,
  hitPoints: number,
  speed: ISpeed,
  abilities: IAbilities,
  savingThrows: string[],
  skills: string[],
  damageResistances: string[],
  damageImmunities: string[],
  conditionImmunities: string[],
  senses: ISenses,
  languages: string[],
  challengeRating: number,
  specialAbilities: IDetail[],
  actions: IDetail[],
  reactions: IDetail[],
  legendaryActions: ICostDetail[]
}

export interface IQuestionaire {
  cr?: string;
  size?: string;
  type?: string;
  text?: string;
  useGPT?: string;
}

export interface IStoryPrompts {
  alignment?: string;
  name?: string;
  size?: string;
  type?: string;
  text?: string;
}
