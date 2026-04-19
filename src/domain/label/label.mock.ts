import { Label } from "./label";

export const labelMock1: Label = {
  id: "label-bug",
  name: "Bug",
  color: "#DC2626",
  description: "Something isn't working",
  projectId: "project-1",
};

export const labelMock2: Label = {
  id: "label-feature",
  name: "Feature",
  color: "#2563EB",
  description: "New feature or request",
  projectId: "project-1",
};

export const labelMock3: Label = {
  id: "label-documentation",
  name: "Documentation",
  color: "#7C3AED",
  description: "Improvements or additions to documentation",
  projectId: "project-1",
};

export const labelMock4: Label = {
  id: "label-ui",
  name: "UI",
  color: "#EC4899",
  description: "User interface related",
  projectId: "project-1",
};

export const labelMock5: Label = {
  id: "label-backend",
  name: "Backend",
  color: "#16A34A",
  description: "Backend/server related",
  projectId: "project-1",
};

export const labelsMockProject1: Label[] = [
  labelMock1,
  labelMock2,
  labelMock3,
  labelMock4,
  labelMock5,
];
