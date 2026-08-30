import { CategoryType } from "@domain/category";

export type GanttTaskId = string;

export interface GanttTask {
  id: GanttTaskId;
  name: string;
  startDate: number;
  endDate: number;
  status: CategoryType;
}
