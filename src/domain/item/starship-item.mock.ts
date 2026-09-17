import { Item } from "./item";

export const COOLANT_CANISTER_ITEM_ID = "0g4c5d6e-item-0004-0000-000000000004";
export const SIGNAL_LOG_ITEM_ID = "0g4c5d6e-item-0005-0000-000000000005";

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
];
