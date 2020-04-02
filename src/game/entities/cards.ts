import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import { PlayerID } from "./players";

export enum Suit {
  Blue = "BLUE",
  Red = "RED",
  Yellow = "YELLOW",
  Green = "GREEN",
}
export const allSuits = [Suit.Blue, Suit.Red, Suit.Yellow, Suit.Green];

export enum SuitLabel {
  Blue = "Blau",
  Red = "Rot",
  Yellow = "Gelb",
  Green = "Grün",
}

export function getSuitLabel(suit: Suit): SuitLabel {
  switch (suit) {
    case Suit.Blue:
      return SuitLabel.Blue;
    case Suit.Red:
      return SuitLabel.Red;
    case Suit.Yellow:
      return SuitLabel.Yellow;
    case Suit.Green:
      return SuitLabel.Green;
    default:
      throw new Error(`given argument is not a suit: ${suit}`);
  }
}

export enum Rank {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
  Thirteen,
  N = 0,
  Z = 26,
}
export const regularRanks = [
  Rank.One,
  Rank.Two,
  Rank.Three,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Eleven,
  Rank.Twelve,
  Rank.Thirteen,
];
export const specialRanks = [Rank.N, Rank.Z];
export const allRanks = [...regularRanks, ...specialRanks];

export interface Card {
  suit: Suit;
  rank: Rank;
}

export function Card(suit: Suit, rank: Rank): Card {
  return { suit, rank };
}

export function cardBeatsOther(
  card: Card,
  other: Card,
  trumpSuit: Suit | null = null,
  leadSuit: Suit | null = null
): boolean {
  // N is lower than all cards (also previously played Ns)
  if (card.rank === Rank.N) {
    return false;
  }
  // always lose against Z
  if (other.rank === Rank.Z) {
    return false;
  }
  // Z is higher than all cards but other Zs
  if (card.rank === Rank.Z) {
    return true;
  }
  // => neither card is Z or N

  // cards of same suit
  if (card.suit === other.suit) {
    return card.rank > other.rank;
  }
  // trump is higher than all non-trump cards
  if (card.suit === trumpSuit) {
    return true;
  }
  if (other.suit === trumpSuit) {
    return false;
  }
  // without trump, highest rank of lead suit wins
  // assume other card is lead card if no lead suit is specified
  const derivedLeadSuit = leadSuit || other.suit;
  // lead-suit card wins over non-lead-suit card
  if (card.suit === derivedLeadSuit) {
    return true;
  }
  if (other.suit === derivedLeadSuit) {
    return false;
  }
  // two differently suited cards which are not trump and lead suit have no winner
  return false;
}

export function getTrickWinner(
  cards: [Card, PlayerID][],
  trumpSuit: Suit | null
): [Card, PlayerID] {
  if (cards.length < 2) {
    throw new Error("too few cards");
  }
  const leadSuit = cards[0][0].suit;
  const winner = cards.reduce((winningCard, card, cardIndex) => {
    // skip first card
    if (cardIndex === 0) return winningCard;
    const beaten = cardBeatsOther(card[0], winningCard[0], trumpSuit, leadSuit);
    return beaten ? card : winningCard;
  }, cards[0]);
  return winner;
}

export function getSuitsInHand(hand: Card[]): Suit[] {
  return allSuits.filter((suit) =>
    hand.find(
      (card) =>
        card.suit === suit && card.rank !== Rank.N && card.rank !== Rank.Z
    )
  );
}

export function canPlayCard(
  card: Card,
  suitsInHand: Suit[],
  leadCard: Card | null
): boolean {
  // as lead, every card can be played
  if (!leadCard) {
    return true;
  }
  // Zs and Ns can always be played
  if (card.rank === Rank.N || card.rank === Rank.Z) {
    return true;
  }
  // Ns cannot be leading card
  if (leadCard.rank === Rank.N) {
    throw new Error("N card cannot be leading card");
  }
  // if Z is leading card, every card can be played
  if (leadCard.rank === Rank.Z) {
    return true;
  }
  // if lead suit is not in hand, every card can be played
  if (!suitsInHand.includes(leadCard.suit)) {
    return true;
  }
  // otherwise card must be of lead suit
  return card.suit === leadCard.suit;
}

export function playableCardsInHand(
  hand: Card[],
  leadCard: Card | null
): boolean[] {
  const suitsInHand = getSuitsInHand(hand);
  return hand.map((card) => canPlayCard(card, suitsInHand, leadCard));
}

export function generateCardDeck(ranks: Rank[] = allRanks): Card[] {
  const cards = flatten(
    allSuits.map((suit) => ranks.map((rank) => ({ suit, rank })))
  );

  return cards;
}

export function sortHand(hand: Card[], trumpSuit?: Suit | null): Card[] {
  // group cards by suit / N / Z
  const groupedHand = groupBy(hand, (card) => {
    if (card.rank === Rank.Z || card.rank === Rank.N) return card.rank;
    return card.suit;
  });

  const sortedGroups = Object.entries(groupedHand)
    // sort groups in this order: [Ns, ... non-trump suits sorted by num card, trump suit, Zs]
    .sort(([keyA, cardsA], [keyB, cardsB]) => {
      // always sort N left and Z right
      if (keyA === Rank.N.toString() || keyB === Rank.Z.toString()) return -1;
      if (keyA === Rank.Z.toString() || keyB === Rank.N.toString()) return 1;
      // always sort trump beside Z
      if (keyA === trumpSuit) return 1;
      if (keyB === trumpSuit) return -1;
      // sort by number of cards of color
      return cardsA.length - cardsB.length;
    })
    // sort cards in each group by rank
    .map(([, cardGroup]) => cardGroup.sort((a, b) => a.rank - b.rank));
  // set sorted hand to state
  return flatten(sortedGroups);
}
