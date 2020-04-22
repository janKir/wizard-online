import { useGameState } from "../GameContext";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { maxCards } from "../../game/entities/players.utils";

export function useGameHeaderElements(): void {
  const {
    wizardState: { numCards, numPlayers, round },
  } = useGameState();
  useHeaderElement("game-players", 2, `${numPlayers} Spieler`);
  useHeaderElement(
    "game-round",
    3,
    `Runde ${numCards} / ${maxCards(numPlayers)}`
  );
  useHeaderElement(
    "game-bids",
    4,
    round?.bidsMismatch !== undefined
      ? `${round.bidsMismatch > 0 ? "+" : ""}
      ${round.bidsMismatch} Stiche Abweichung 
      ${round.bidsMismatch > 0 ? "(offensiv)" : ""}
      ${round.bidsMismatch < 0 ? "(defensiv)" : ""}
      ${round.bidsMismatch === 0 ? "(ausgeglichen)" : ""}`
      : ""
  );
}
