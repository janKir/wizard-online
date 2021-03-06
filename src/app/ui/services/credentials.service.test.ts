import * as dateMock from "jest-date-mock";
import {
  addToStore,
  getCredentials,
  storageKey,
  setCredentials,
  CredentialsStore,
} from "./credentials.service";

beforeEach(() => {
  localStorage.clear();
  dateMock.clear();
});

const timestamp = new Date(2020, 2, 19, 15, 17, 11);
const store: CredentialsStore = {
  "test-1": {
    playerID: 0,
    credentials: "aaa",
    timestamp: timestamp.getTime(),
  },
  "test-2": {
    playerID: 2,
    credentials: "bbb",
    timestamp: timestamp.getTime(),
  },
  "test-3": {
    playerID: 1,
    credentials: "ccc",
    timestamp: timestamp.getTime(),
  },
};

describe("addToStore", () => {
  const gameID = "test-game";
  const playerID = 3;
  const credentials = "test-credentials";

  test("new store contains given key/credentials", () => {
    const result = addToStore({}, gameID, playerID, credentials);
    expect(result).toHaveProperty(gameID);
    expect(result[gameID].credentials).toBe(credentials);
    expect(result[gameID].playerID).toBe(playerID);
  });

  test("new store contains timestamp", () => {
    dateMock.advanceTo(timestamp);
    const result = addToStore({}, gameID, playerID, credentials);
    expect(result).toHaveProperty(gameID);
    expect(result[gameID].timestamp).toBe(timestamp.getTime());
  });

  test("new store contains all elements of old store", () => {
    const result = addToStore(store, gameID, playerID, credentials);

    Object.entries(store).forEach(([prop, value]) => {
      expect(result).toHaveProperty(prop);
      expect(result[prop]).toBe(value);
    });
  });
});

describe("getCredentials", () => {
  beforeEach(() => {
    localStorage.setItem(storageKey, JSON.stringify(store));
  });
  test("gets credentials for existing key", () => {
    const credentials = getCredentials("test-1");
    expect(credentials).toBeDefined();
    expect(credentials?.credentials).toBe("aaa");
    expect(credentials?.playerID).toBe(0);
  });

  test("returns undefined for non-existing key", () => {
    const credentials = getCredentials("test-5");
    expect(credentials).toBeUndefined();
  });
});

describe("setCredentials", () => {
  test("store contains given credentials", () => {
    localStorage.setItem(storageKey, JSON.stringify(store));
    dateMock.advanceTo(timestamp);
    setCredentials("test", 4, "ddd");
    const expected = {
      ...store,
      test: {
        playerID: 4,
        credentials: "ddd",
        timestamp: timestamp.getTime(),
      },
    };
    const rawStore = localStorage.getItem(storageKey);
    expect(rawStore).toBeDefined();
    const parsedStore = JSON.parse(rawStore!);
    expect(parsedStore).toEqual(expected);
  });

  test("store is initialized if not existing before", () => {
    dateMock.advanceTo(timestamp);
    setCredentials("test", 4, "ddd");
    const expected = {
      test: {
        playerID: 4,
        credentials: "ddd",
        timestamp: timestamp.getTime(),
      },
    };
    const rawStore = localStorage.getItem(storageKey);
    expect(rawStore).toBeDefined();
    const parsedStore = JSON.parse(rawStore!);
    expect(parsedStore).toEqual(expected);
  });
});
