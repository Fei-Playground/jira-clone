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
    "absolute left-0 top-0 z-50 box-border grid h-full w-full place-items-center overflow-y-auto px-3 py-4 sm:px-[40px] sm:py-[40px]",
    "radix-state-open:animate-fade-in backdrop-blur-md duration-300"
  )
);
export const Content = twix(
  Dialog.Content,
  cx(
    "relative z-50 w-full max-w-[1000px] rounded-md bg-elevation-surface px-4 py-5 text-font shadow-lg sm:w-4/5 sm:px-8 sm:py-6",
    "duration-300 radix-state-open:animate-slide-up"
  )
);

export const Title = twix(Dialog.Title, "mb-5 font-primary-black text-3xl");
