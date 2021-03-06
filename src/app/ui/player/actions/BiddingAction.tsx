import React, { useState } from "react";
import { FormControl, Button, Slider } from "@material-ui/core";
import styled from "styled-components";
import range from "lodash/range";
import { useGameState } from "../../GameContext";
import { isValidBid } from "../../../../shared/entities/bid.utils";
import { isSetRound } from "../../../../shared/WizardState";

export const BiddingAction: React.FC = () => {
  const {
    wizardState: { roundIndex, rounds, currentPlayer, round },
    moves: { bid },
  } = useGameState();
  const numCards = rounds[roundIndex];

  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  const { bids } = round;
  const [bidValue, setBidValue] = useState(0);
  const valid = isValidBid(bidValue, numCards, bids, currentPlayer);

  const marks = range(0, numCards + 1).map((value) => ({
    value,
    label: isValidBid(value, numCards, bids, currentPlayer)
      ? value.toString()
      : "❌",
  }));

  return (
    <Row>
      <RowElement>
        <Field>
          <Slider
            value={bidValue}
            onChange={(_, newValue) => setBidValue(newValue as number)}
            step={1}
            min={0}
            max={numCards}
            marks={marks}
            valueLabelDisplay="auto"
            aria-label="Stiche ansagen"
          />
        </Field>
      </RowElement>
      <RowElement>
        <Button
          onClick={() => {
            if (valid) bid(bidValue);
          }}
          type="button"
          disabled={!valid}
          color="primary"
          variant="contained"
        >
          {bidValue} Stich{bidValue !== 1 && "e"} ansagen
        </Button>
      </RowElement>
    </Row>
  );
};

const Row = styled.form`
  display: flex;
  flex-direction: row;
  margin: 0px -10px;
  align-items: center;
`;

const RowElement = styled.div`
  margin: 0 10px;
`;

const Field = styled(FormControl)`
  width: 300px;
`;
