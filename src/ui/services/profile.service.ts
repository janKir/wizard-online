import flow from "lodash/fp/flow";

export const storageKey = "wizard-profile";

export interface ProfileStore {
  name: string;
  handOrderPreference?: HandOrderPreference;
}

export interface ProfileStoreWithId extends ProfileStore {
  id: string;
}

export enum HandOrderPreference {
  None = "none",
  Sorted = "sorted",
}

export const handOrderPreferences = [
  HandOrderPreference.None,
  HandOrderPreference.Sorted,
];

export function getHandOrderPreferenceLabel(
  handOrderPreference: HandOrderPreference
): string {
  switch (handOrderPreference) {
    case HandOrderPreference.None:
      return "Nicht sortieren";
    case HandOrderPreference.Sorted:
      return "Sortieren";
    default:
      return "";
  }
}

export function getProfile(): ProfileStoreWithId | null {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "null",
    (value) => JSON.parse(value) as ProfileStoreWithId
  )();
}

export function setProfile(profile: ProfileStore): void {
  const id = `${profile.name}_${Date.now()}`;
  localStorage.setItem(storageKey, JSON.stringify({ ...profile, id }));
}

export function updateProfile(changes: Partial<ProfileStore>): void {
  flow(
    () => localStorage.getItem(storageKey),
    (value) => {
      if (!value) {
        throw new Error("cannot update profile if it is undefined");
      }
      return value;
    },
    JSON.parse,
    ({ id, ...store }) => ({ ...store, ...changes, id }),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}
