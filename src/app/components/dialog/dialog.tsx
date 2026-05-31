import * as Dialog from "@radix-ui/react-dialog";
import cx from "classix";
import { twix } from "tailwindcss-radix-ui";

export const Root = Dialog.Root;
export const Trigger = Dialog.Trigger;
export const Portal = Dialog.Portal;
export const Description = Dialog.Description;
export const Close = Dialog.Close;

export const Overlay = twix(
  Dialog.Overlay,
  cx(
    "absolute left-0 top-0 z-50 box-border grid h-full w-full place-items-center overflow-y-auto px-[40px] py-[40px]",
    "radix-state-open:animate-fade-in backdrop-blur-md duration-300"
  )
);
export const Content = twix(
  Dialog.Content,
  cx(
    "relative z-50 w-4/5 max-w-[1000px] rounded-md bg-elevation-surface px-8 py-6 text-font shadow-lg",
    "duration-300 radix-state-open:animate-slide-up"
  )
);

export const Title = twix(Dialog.Title, "mb-5 font-primary-black text-3xl");
