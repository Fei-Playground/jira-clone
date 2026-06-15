export type RewardId = string;
export type RewardCategory = "fun" | "time" | "experience";

export interface Reward {
  id: RewardId;
  name: string;
  description: string;
  pointCost: number;
  emoji: string;
  category: RewardCategory;
}
