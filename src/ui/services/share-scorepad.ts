import { ScorePad, ScoreRow } from "../../game/entities/score";

export type SharableScorePad = SharableScoreRow[];
export type SharableScoreRow = [number, SharableScore[]];
export type SharableScore = [number, number];

export function fromScorePad(scorePad: ScorePad): SharableScorePad {
  return scorePad.map(({ numCards, playerScores }) => [
    numCards,
    playerScores.map(({ bid, tricks }) => [bid, tricks]),
  ]);
}

export function toScorepad(sharableScorepad: SharableScorePad): ScorePad {
  return sharableScorepad.reduce((scorePad, [numCards, scores]) => {
    const previousScoreRow = scorePad[scorePad.length - 1];
    const scoreRow: ScoreRow = {
      numCards,
      playerScores: scores.map(([bid, tricks], playerID) => {
        const score =
          bid === tricks ? 20 + bid * 10 : Math.abs(bid - tricks) * -10;
        return {
          bid,
          tricks,
          score,
          total: (previousScoreRow?.playerScores[playerID].total ?? 0) + score,
        };
      }),
    };
    return [...scorePad, scoreRow];
  }, [] as ScorePad);
}
