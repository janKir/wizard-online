import { WizardCharacter } from "../util/character-theme";

export function getAvatarUrl(name: string, character: WizardCharacter): string {
  return `https://robohash.org/${name}?set=set${characterToSet(character)}`;
}

function characterToSet(character: WizardCharacter): 1 | 2 | 3 | 4 | 5 {
  switch (character) {
    case WizardCharacter.Elf:
      return 1;
    case WizardCharacter.Giant:
      return 2;
    case WizardCharacter.Human:
      return 5;
    case WizardCharacter.Dwarf:
      return 4;
    default:
      return 3;
  }
}
