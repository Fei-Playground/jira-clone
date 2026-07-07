import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdClose, MdRestartAlt } from "react-icons/md";
import cx from "classix";
import {
  useColorPalette,
  ColorPalette,
  PALETTE_PRESETS,
} from "@app/store/color-palette.store";
import { Tooltip } from "@app/components/tooltip";

interface ColorPickerRowProps {
  label: string;
  colorKey: keyof ColorPalette;
  value: string;
  onChange: (key: keyof ColorPalette, value: string) => void;
}

const ColorPickerRow = ({
  label,
  colorKey,
  value,
  onChange,
}: ColorPickerRowProps): JSX.Element => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-font-subtle">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-font-subtlest">{value}</span>
      <label className="relative h-7 w-7 cursor-pointer overflow-hidden rounded border border-border shadow-sm">
        <span
          className="block h-full w-full rounded"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={`Pick color for ${label}`}
        />
      </label>
    </div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps): JSX.Element => (
  <div className="mb-4">
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-font-subtlest">
      {title}
    </h3>
    <div className="rounded-md bg-elevation-surface-sunken px-3 py-1">
      {children}
    </div>
  </div>
);

export const ColorPalettePanel = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { palette, updateColor, resetToDefault, applyPreset } =
    useColorPalette();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip title="Customize colors">
        <Dialog.Trigger
          aria-label="Open color palette settings"
          className="group flex h-[30px] w-[30px] rounded-full outline outline-2 outline-icon flex-center hover:bg-background-brand-subtlest hover:outline-border-brand"
        >
          <IoColorPaletteOutline className="text-icon group-hover:text-icon-brand" size={17} />
        </Dialog.Trigger>
      </Tooltip>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cx(
            "fixed right-4 top-[52px] z-50 flex max-h-[calc(100vh-64px)] w-[320px] flex-col rounded-lg shadow-xl",
            "bg-elevation-surface-overlay text-font"
          )}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Dialog.Title className="text-base font-semibold">
              Color Customization
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefault}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-font-subtle hover:bg-background-neutral"
                aria-label="Reset to defaults"
              >
                <MdRestartAlt size={14} />
                Reset
              </button>
              <Dialog.Close
                aria-label="Close panel"
                className="rounded p-1 text-icon hover:bg-background-neutral"
              >
                <MdClose size={18} />
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Preset Palettes */}
            <div className="mb-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-font-subtlest">
                Preset Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {PALETTE_PRESETS.map(({ name, palette: preset }) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(preset)}
                    className="group flex flex-col items-center gap-1.5 rounded-lg border border-border px-3 py-2 hover:border-border-brand hover:bg-background-brand-subtlest"
                    aria-label={`Apply ${name} preset`}
                  >
                    {/* Color dots preview */}
                    <div className="flex gap-0.5">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: preset.navbarColor }}
                      />
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: preset.backgroundColor }}
                      />
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: preset.columnTodo }}
                      />
                    </div>
                    <span className="text-xs text-font-subtle group-hover:text-font-brand">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* App Colors */}
            <Section title="App Colors">
              <ColorPickerRow
                label="Background"
                colorKey="backgroundColor"
                value={palette.backgroundColor}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="Navbar"
                colorKey="navbarColor"
                value={palette.navbarColor}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="Header bar"
                colorKey="headerColor"
                value={palette.headerColor}
                onChange={updateColor}
              />
            </Section>

            {/* Column Colors */}
            <Section title="Board Columns">
              <ColorPickerRow
                label="To Do"
                colorKey="columnTodo"
                value={palette.columnTodo}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="In Progress"
                colorKey="columnInProgress"
                value={palette.columnInProgress}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="Done"
                colorKey="columnDone"
                value={palette.columnDone}
                onChange={updateColor}
              />
            </Section>

            {/* Priority Colors */}
            <Section title="Task Priority Colors">
              <ColorPickerRow
                label="🟢 Low priority"
                colorKey="priorityLow"
                value={palette.priorityLow}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="🟡 Medium priority"
                colorKey="priorityMedium"
                value={palette.priorityMedium}
                onChange={updateColor}
              />
              <ColorPickerRow
                label="🔴 High priority"
                colorKey="priorityHigh"
                value={palette.priorityHigh}
                onChange={updateColor}
              />
            </Section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
