import { Milestone } from "./milestone";

export const milestoneMock1: Milestone = {
  id: "ms-alpha-release",
  name: "Alpha release",
  date: new Date("2022-01-21T00:00:00").valueOf(),
};

export const milestoneMock2: Milestone = {
  id: "ms-beta-launch",
  name: "Beta launch",
  date: new Date("2022-02-04T00:00:00").valueOf(),
};

export const milestoneMock3: Milestone = {
  id: "ms-ga",
  name: "GA",
  date: new Date("2022-02-18T00:00:00").valueOf(),
};

export const milestonesMock: Milestone[] = [milestoneMock1, milestoneMock2, milestoneMock3];
