import { Ctx } from "boardgame.io";
import { generateCardDeck } from "./entities/cards.utils";
import { NumPlayers, PlayerID } from "./entities/players";
import { Phase } from "./phases/phase";
import { ScorePad } from "./entities/score";
import { Card, Suit, Rank } from "./entities/cards";
import { OptionalTrickCard, TrickCard } from "./entities/trick";
import { generateRounds } from "./entities/round.utils";

/**
 * Describes the Wizard game state used in the g object.
 *
 * @export
 * @interface WizardState
 */
export interface WizardState {
  config: WizardConfig;
  // round-specific state which is resetted after each round
  round: WizardRoundState | null;
  // trick-specific state which is resetted after each trick
  trick: WizardTrickState | null;
  // general game state
  rounds: number[];
  roundIndex: number;
  dealer: PlayerID;
  currentPlayer: PlayerID;
  scorePad: ScorePad;
  numPlayers: NumPlayers;
  phase: Phase;
}

export interface WizardConfig {
  tournamentMode?: boolean;
  inspectPreviousTrick?: boolean;
}

/**
 * Describes trick-specific Wizard game state
 *
 * @export
 * @interface WizardTrickState
 */
export interface WizardTrickState {
  cards: OptionalTrickCard[];
  lead?: Card;
  isComplete?: boolean;
}

/**
 * Describes round-specific Wizard game state
 *
 * @export
 * @interface WizardRoundState
 */
export interface WizardRoundState {
  bids: (number | null)[];
  bidsMismatch?: number;
  hands: (Card | null)[][];
  handsMeta: (HandMeta | null)[];
  trickCount: number[];
  trump: Trump;
  deck: (Card | null)[];
  previousTrick?: TrickCard[];
  isComplete?: boolean;
}

export type HandMeta = {
  total: number;
  suits: {
    [suit in Suit]: number;
  };
  ranks: {
    [rank in Rank]: number;
  };
};

/**
 * Describes the round's trump suit.
 * card: contains the trump card if given (i.e. not in the last round)
 * suit: contains the trump suit. This is redudant to the card's suit most of the time
 * but serves for the case when the trump card is a Z and the dealer selects a trump suit.
 *
 * @export
 * @interface Trump
 */
export interface Trump {
  card: Card | null | undefined;
  suit?: Suit | null;
}

export interface WizardSetupData {
  config?: WizardConfig;
}

/**
 * Checks if a trick is set.
 * Function uses typescript guards:
 * If used in conditions, typescript knows this trick is not null in following code.
 *
 * @export
 * @param {(WizardTrickState | null)} trick
 * @returns {trick is WizardTrickState} true if trick is set, otherwise false
 */
export function isSetTrick(
  trick: WizardTrickState | null
): trick is WizardTrickState {
  return !!trick;
}

/**
 * Checks if a guard is set.
 * Function uses typescript guards:
 * If used in conditions, typescript knows this variable is not null in following code.
 *
 * @export
 * @param {(WizardRoundState | null)} round
 * @returns {round is WizardRoundState}
 */
export function isSetRound(
  round: WizardRoundState | null
): round is WizardRoundState {
  return !!round;
}

/**
 * Generates a WizardState with default values.
 *
 * @param {Ctx} ctx
 * @param {{ setRound?: boolean; setTrick?: boolean }} [{
 *     setRound = true,
 *     setTrick = true,
 *   }={}]
 * @returns {WizardState}
 */
export const generateDefaultWizardState = (
  ctx: Ctx,
  setupData: WizardSetupData = {},
  {
    round: roundOptions,
    trick: trickOptions,
    ...options
  }: Partial<WizardState> = {}
): WizardState => {
  const config = setupData.config ?? {};
  const numPlayers = ctx.numPlayers as NumPlayers;
  const round =
    roundOptions !== null
      ? generateBlankRoundState(ctx, numPlayers, roundOptions)
      : null;
  const trick =
    trickOptions !== null ? generateBlankTrickState(trickOptions) : null;
  const defaultValues = {
    config,
    roundIndex: 0,
    rounds: generateRounds(numPlayers, config.tournamentMode),
    dealer: -1 as PlayerID,
    scorePad: [],
    numPlayers,
    currentPlayer: Number.parseInt(ctx.currentPlayer, 10) as PlayerID,
    phase: ctx.phase as Phase,
  };
  return {
    ...defaultValues,
    round,
    trick,
    ...options,
  };
};

/**
 * Generates a blank WizardRoundState
 *
 * @export
 * @param {NumPlayers} numPlayers
 * @returns {WizardRoundState}
 */
export function generateBlankRoundState(
  ctx: Ctx,
  numPlayers: NumPlayers,
  options: Partial<WizardRoundState> = {}
): WizardRoundState {
  const defaultValues = {
    bids: new Array(numPlayers).fill(null),
    hands: new Array(numPlayers).fill([]),
    handsMeta: new Array(numPlayers).fill(null),
    trickCount: new Array(numPlayers).fill(null),
    trump: { card: null },
    deck: ctx.random!.Shuffle(generateCardDeck()),
  };
  return {
    ...defaultValues,
    ...options,
  };
}

/**
 * Generates a blank WizardTrickState
 *
 * @export
 * @returns {WizardTrickState}
 */
export function generateBlankTrickState(
  options: Partial<WizardTrickState> = {}
): WizardTrickState {
  const defaultValues = {
    cards: [],
  };
  return {
    ...defaultValues,
    ...options,
  };
}
