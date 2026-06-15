import { useState } from "react";
import { Project } from "@domain/project";
import { Reward } from "@domain/reward";
import { Button } from "@app/components/button";

/**
 * Converts priority IDs to point values.
 * Priority point values match the "★ 10/15/20 pts" labels shown throughout the UI.
 */
const getPointsForPriority = (priorityId: string): number => {
  const pointsMap: Record<string, number> = { low: 10, medium: 15, high: 20 };
  return pointsMap[priorityId] || 0;
};

export const RewardsView = ({ project, rewards }: Props): JSX.Element => {
  const doneCategory = project.categories.find((c) => c.type === "DONE");
  const doneIssues = doneCategory?.issues || [];

  // Calculate total points earned from done missions
  const totalPointsEarned = doneIssues.reduce(
    (sum, issue) => sum + getPointsForPriority(issue.priority.id),
    0
  );

  // Track which rewards have been redeemed (client-side only, no DB persistence yet)
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());

  // Calculate points spent on redeemed rewards
  const pointsSpent = rewards
    .filter((r) => redeemedIds.has(r.id))
    .reduce((sum, r) => sum + r.pointCost, 0);

  const pointsAvailable = totalPointsEarned - pointsSpent;

  /**
   * Handle reward redemption.
   * Deducts the reward's point cost from available points by marking it as redeemed.
   * No DB persistence — state resets on page reload.
   */
  const handleRedeem = (rewardId: string, pointCost: number) => {
    if (pointsAvailable >= pointCost && !redeemedIds.has(rewardId)) {
      setRedeemedIds((prev) => new Set(prev).add(rewardId));
    }
  };

  return (
    <div className="max-w-6xl p-6">
      {/* Points Banner */}
      <div className="mb-8 rounded-xl bg-background-brand-subtlest p-6 shadow-xs">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl">⭐</span>
          <span className="font-primary-black text-4xl text-font-brand">
            {pointsAvailable}
          </span>
          <span className="font-primary-bold text-2xl text-font">pts</span>
        </div>
        <p className="mt-2 font-primary-light text-sm text-font-subtle">
          Keep completing missions to earn more!
        </p>
      </div>

      {/* Header */}
      <h1 className="mb-2 font-primary-black text-2xl text-font">
        🎁 Reward Shop
      </h1>
      <p className="mb-6 font-primary-light text-font-subtle">
        Spend your points on rewards you&apos;ve earned!
      </p>

      {/* Reward Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {rewards.map((reward) => {
          const isRedeemed = redeemedIds.has(reward.id);
          const canAfford = pointsAvailable >= reward.pointCost;

          return (
            <div
              key={reward.id}
              className="flex flex-col gap-3 rounded-xl bg-elevation-surface-raised p-5 shadow-xs"
            >
              {/* Emoji */}
              <div className="text-4xl">{reward.emoji}</div>

              {/* Reward Name */}
              <h3 className="font-primary-bold text-font">{reward.name}</h3>

              {/* Description */}
              <p className="flex-grow font-primary-light text-sm text-font-subtle">
                {reward.description}
              </p>

              {/* Point Cost Badge */}
              <div className="flex items-center gap-1 font-primary-bold text-sm text-font-brand">
                <span>⭐</span>
                <span>{reward.pointCost} pts</span>
              </div>

              {/* Redeem Button */}
              {isRedeemed ? (
                <Button
                  color="success"
                  variant="subtlest"
                  disabled
                  className="w-full"
                >
                  Redeemed ✓
                </Button>
              ) : canAfford ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleRedeem(reward.id, reward.pointCost)}
                  className="w-full"
                >
                  Redeem
                </Button>
              ) : (
                <Button
                  color="neutral"
                  variant="subtlest"
                  disabled
                  className="w-full"
                >
                  Not enough pts
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface Props {
  project: Project;
  rewards: Reward[];
}
