import range from "lodash/range";
import { generateCtx } from "../util/ctx.util";
import { defaultG, G } from "../G";
import { setup } from "./setup";

describe("shuffle", () => {
  test("creates new deck", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const originalDeck = g.round!.deck;
    setup.moves!.shuffle(g, ctx);
    expect(g.round!.deck).not.toBe(originalDeck);
  });
});

describe("handout", () => {
  test("gives each player the specified number of hand cards", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    setup.moves!.handout(g, ctx);
    g.round!.hands.forEach((hand) => {
      expect(hand).toBeInstanceOf(Array);
      expect(hand.length).toBe(g.game.numCards);
    });
  });

  test("sets trump", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);

    const expectedTrump = g.round!.deck[
      g.round!.deck.length - g.game.numCards * ctx.numPlayers - 1
    ];
    setup.moves!.handout(g, ctx);
    expect(g.round!.trump).toBe(expectedTrump);
  });

  test("removes cards from deck when handing them out to players", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const originalLength = g.round!.deck.length;
    setup.moves!.handout(g, ctx);
    expect(g.round!.deck.length).toBe(
      originalLength - ctx.numPlayers * g.game.numCards - 1
    );
  });

  test("distributes cards one by one", () => {
    const ctx = generateCtx();
    const g: G = defaultG(ctx);

    const cardsPlayer1 = range(0, g.game.numCards).map(
      (cardI) =>
        g.round!.deck[g.round!.deck.length - 1 - ctx.numPlayers * cardI]
    );

    setup.moves!.handout(g, ctx);

    expect(g.round!.hands[1]).toEqual(cardsPlayer1);
  });

  test("distributes cards to players in correct order", () => {
    const ctx = generateCtx();
    const g: G = defaultG(ctx);

    const playerOrder = [1, 2, 3, 0];
    const expectedFirstCardByPlayer = playerOrder.map(
      (_, index) => g.round!.deck[g.round!.deck.length - 1 - index]
    );

    setup.moves!.handout(g, ctx);

    playerOrder.forEach((player, i) => {
      expect(g.round!.hands[player][0]).toBe(expectedFirstCardByPlayer[i]);
    });
  });

  test("dispatches endPhase event", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const mockEndPhase = jest.fn();
    ctx.events!.endPhase = mockEndPhase;

    setup.moves!.handout(g, ctx);

    expect(mockEndPhase).toBeCalled();
  });
});