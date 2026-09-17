import { Locale } from "@app/locales";
import { ItemId } from "./item";
import {
  BRASS_KEY_ITEM_ID,
  SEALED_LETTER_ITEM_ID,
  BOAT_TICKET_ITEM_ID,
  STORM_TALISMAN_ITEM_ID,
} from "./item.mock";
import { COOLANT_CANISTER_ITEM_ID, SIGNAL_LOG_ITEM_ID } from "./starship-item.mock";

export interface ItemText {
  name: string;
  description: string;
}

export const itemTextByLocale: Record<Locale, Record<ItemId, ItemText>> = {
  [Locale.EN]: {
    [BRASS_KEY_ITEM_ID]: {
      name: "Brass Key",
      description: "A tarnished brass key, warm from someone else's pocket.",
    },
    [SEALED_LETTER_ITEM_ID]: {
      name: "Sealed Letter",
      description: "A letter closed with a wax seal, addressed to no one in particular.",
    },
    [BOAT_TICKET_ITEM_ID]: {
      name: "Boat Ticket",
      description: "A single ticket for the last ship out of the harbor.",
    },
    [STORM_TALISMAN_ITEM_ID]: {
      name: "Storm-Worn Talisman",
      description:
        "A small carved talisman, its edges smoothed by years of being clutched through worse storms than this one.",
    },
    [COOLANT_CANISTER_ITEM_ID]: {
      name: "Coolant Canister",
      description: "A spare canister of ion-drive coolant, still cold to the touch.",
    },
    [SIGNAL_LOG_ITEM_ID]: {
      name: "Signal Log",
      description: "A patient log of an anomalous signal, timestamped over several days.",
    },
  },
  [Locale.ZH]: {
    [BRASS_KEY_ITEM_ID]: {
      name: "铜钥匙",
      description: "一把有些锈迹的铜钥匙，还带着别人口袋里的余温。",
    },
    [SEALED_LETTER_ITEM_ID]: {
      name: "封蜡信件",
      description: "一封用蜡封好的信，收信人一栏写得含糊不清。",
    },
    [BOAT_TICKET_ITEM_ID]: {
      name: "船票",
      description: "一张离港最后一班船的船票。",
    },
    [STORM_TALISMAN_ITEM_ID]: {
      name: "风暴护身符",
      description:
        "一枚雕工粗糙的小护身符，边缘早已被年复一年地摩挲得光滑——比这场风暴更凶险的日子，它都挺过来了。",
    },
    [COOLANT_CANISTER_ITEM_ID]: {
      name: "冷却剂罐",
      description: "一罐备用的离子引擎冷却剂，摸上去还是凉的。",
    },
    [SIGNAL_LOG_ITEM_ID]: {
      name: "信号日志",
      description: "一份记录了好几天的异常信号日志，带有详细的时间戳。",
    },
  },
};

export const getItemText = (itemId: ItemId, locale: Locale): ItemText | undefined =>
  itemTextByLocale[locale]?.[itemId];
