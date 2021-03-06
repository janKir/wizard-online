import React from "react";
import styled, { css } from "styled-components";
import { Suit } from "../../../shared/entities/cards";
import { PlayCard } from "../components/playcard/PlayCard";
import { useGameState } from "../GameContext";
import { isSetRound } from "../../../shared/WizardState";
import { cardColors, ColorSet } from "../util/colors";

export const Deck: React.FC = () => {
  const {
    wizardState: { round },
  } = useGameState();
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const trump = round?.trump;
  const color = getColor(trump?.suit);

  return (
    <DeckContainer trump={color.text}>
      <CardOutline disabled={trump.card === undefined}>
        <PlayCard card={trump.card} interactive={false} />
      </CardOutline>
    </DeckContainer>
  );
};

const DeckContainer = styled.div<{ trump: string }>`
  transform: rotate(-90deg);
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ trump }) => trump};
  border-radius: 50%;
  margin-left: 25px;
  margin-right: 25px;
`;

const CardOutline = styled.div<{ disabled?: boolean }>`
  ${({ disabled }) =>
    disabled
      ? ""
      : css`
          border-radius: 7px;
          box-shadow: -2px 2px 2px black;
        `}
`;

function getColor(suit: Suit | null | undefined): ColorSet {
  switch (suit) {
    case Suit.Blue:
      return cardColors.blue;
    case Suit.Green:
      return cardColors.green;
    case Suit.Red:
      return cardColors.red;
    case Suit.Yellow:
      return cardColors.yellow;
    case null:
      return cardColors.zn;
    // fallback
    default:
      return {
        text: "lightgrey",
        outline: "lightgrey",
        background: "lightgrey",
      };
  }
}
