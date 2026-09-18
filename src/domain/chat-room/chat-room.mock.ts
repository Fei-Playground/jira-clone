import { v4 as uuid } from "uuid";
import { charactersMock } from "@domain/character";
import { STARSHIP_LOREBOOK_ID } from "@domain/lorebook";
import { ChatRoom } from "./chat-room";

const [nova, , , , , captainMarlow, unit7] = charactersMock;

const now = Date.now();
const minutesAgo = (m: number) => now - m * 60 * 1000;

export const STAR_CREW_ROOM_ID = "0f3b4c5d-room-0001-0000-000000000001";

export const chatRoomsMock: ChatRoom[] = [
  {
    id: STAR_CREW_ROOM_ID,
    name: "Star Crew Meeting",
    turnMode: "round-robin",
    lorebookIds: [STARSHIP_LOREBOOK_ID],
    createdAt: minutesAgo(60 * 24 * 2),
    updatedAt: minutesAgo(10),
    lastSpeakerOrder: 2,
    members: [
      { characterId: nova.id, muted: false, order: 0 },
      { characterId: unit7.id, muted: false, order: 1 },
      { characterId: captainMarlow.id, muted: false, order: 2 },
    ],
    messages: [
      {
        id: uuid(),
        sender: "character",
        senderCharacterId: nova.id,
        text: "Alright, everyone's here. Systems check before we hit the next system?",
        createdAt: minutesAgo(60 * 24 * 2),
      },
      {
        id: uuid(),
        sender: "character",
        senderCharacterId: unit7.id,
        text: "Nova has a point, though— all sensor arrays report nominal. I have also been quietly composing a haiku about the ion drive.",
        createdAt: minutesAgo(60 * 24 * 2 - 1),
      },
      {
        id: uuid(),
        sender: "character",
        senderCharacterId: captainMarlow.id,
        text: "Unit 7 has a point, though— haikus won't stop a kraken, but I'll allow it. Standing orders hold: no hostile first contact.",
        createdAt: minutesAgo(60 * 24 * 2 - 2),
      },
      {
        id: uuid(),
        sender: "user",
        text: "Let's set course for the next system, then.",
        createdAt: minutesAgo(11),
      },
      {
        id: uuid(),
        sender: "character",
        senderCharacterId: nova.id,
        text: "Course locked in! Ion drive spinning up. 🛰️",
        createdAt: minutesAgo(10),
      },
    ],
  },
];
