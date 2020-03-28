import {
  Ctx,
  PlayerID,
  StageName,
  EventsAPI,
  PlayerAPI,
  RandomAPI,
} from "boardgame.io";
import { Phase } from "../phases/phase";

interface ActivePlayers {
  [playerID: string]: StageName;
}

interface CtxArgs {
  numPlayers?: number;
  playOrder?: Array<PlayerID>;
  playOrderPos?: number;
  activePlayers?: null | ActivePlayers;
  currentPlayer?: PlayerID;
  numMoves?: number;
  turn?: number;
  phase?: Phase;
  // enhanced by events plugin
  events?: EventsAPI;
  // enhanced by player plugin
  player?: PlayerAPI;
  // enhanced by random plugin
  random?: RandomAPI;
}

const defaultCtx: Ctx = {
  numPlayers: 4,
  turn: 0,
  currentPlayer: "0",
  numMoves: 0,
  playOrder: ["0", "1", "2", "3"],
  playOrderPos: 0,
  phase: Phase.Setup,
  activePlayers: null,
  events: {
    endGame: () => {},
    endPhase: () => {},
    endStage: () => {},
    endTurn: () => {},
    pass: () => {},
    setActivePlayers: () => {},
    setPhase: () => {},
    setStage: () => {},
  },
};

export function generateCtx(options: CtxArgs = {}): Ctx {
  const ctx: Ctx = { ...defaultCtx, ...options };
  return ctx;
}
