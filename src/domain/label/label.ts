export type LabelId = string;

export interface Label {
  id: LabelId;
  name: string;
  color: string;
  description?: string;
  projectId: string;
}
