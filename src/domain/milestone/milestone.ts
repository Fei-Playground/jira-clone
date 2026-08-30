export type MilestoneId = string;

export interface Milestone {
  id: MilestoneId;
  name: string;
  /** Target date as epoch milliseconds (start of day). */
  date: number;
}
