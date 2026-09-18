import { Item } from "./item";

export const COOLANT_CANISTER_ITEM_ID = "0g4c5d6e-item-0004-0000-000000000004";
export const SIGNAL_LOG_ITEM_ID = "0g4c5d6e-item-0005-0000-000000000005";
export const CAPTAINS_COMMENDATION_ITEM_ID = "0g4c5d6e-item-0009-0000-000000000009";
export const GALLEY_FAVOR_TOKEN_ITEM_ID = "0g4c5d6e-item-0010-0000-000000000010";

export const starshipItemsMock: Item[] = [
  {
    id: COOLANT_CANISTER_ITEM_ID,
    name: "Coolant Canister",
    description: "A spare canister of ion-drive coolant, still cold to the touch.",
    emoji: "🧊",
  },
  {
    id: SIGNAL_LOG_ITEM_ID,
    name: "Signal Log",
    description: "A patient log of an anomalous signal, timestamped over several days.",
    emoji: "📡",
  },
  {
    id: CAPTAINS_COMMENDATION_ITEM_ID,
    name: "Captain's Commendation",
    description: "A small printed slip, signed by Marlow, for reporting the galley trade.",
    emoji: "🎖️",
  },
  {
    id: GALLEY_FAVOR_TOKEN_ITEM_ID,
    name: "Galley Favor Token",
    description:
      "A chipped ceramic token — redeemable for one off-the-books favor from the galley.",
    emoji: "🍽️",
  },
];
