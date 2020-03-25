/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { G } from "../G";

export const predict: PhaseConfig = {
  moves: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predictNumberOfTricks(g: G, ctx: Ctx, numberOfTricks: number): any {
      if (numberOfTricks < 0 || numberOfTricks > g.numCardsOnHand) {
        return INVALID_MOVE;
      }
      const isNotFirstRound = g.numCardsOnHand > 1;
      const isLastPlayer =
        g.score.filter(
          (score, i) => i !== parseInt(ctx.currentPlayer, 10) && score === null
        ).length === 0;
      const isTotalPredictionEven =
        [numberOfTricks, ...g.score].reduce(
          (sum, value) => (sum || 0) + (value || 0),
          0
        ) === g.numCardsOnHand;
      if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
        return INVALID_MOVE;
      }
      g.score[parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.events!.endTurn!();
    },
  },
  endIf(g: G) {
    return !g.score.includes(null);
  },
  next: "play",
};
