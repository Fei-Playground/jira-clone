import * as Dialog from "@app/components/dialog";
import * as Select from "@app/components/select";
import { Button } from "@app/components/button";
import { SelctTheme } from "@app/ui/main/header/select-theme";
// Note: imported directly since header's barrel only re-exports the Header component.
import { SelectLocale } from "@app/ui/main/header/select-locale";
import { useTranslation } from "@app/store/locale.store";
import { ResponseStyle, useCompanionsStore } from "../companions.store";

export const CompanionSettings = ({
  isOpen,
  onClose,
}: CompanionSettingsProps): JSX.Element => {
  const { settings, setSettings } = useCompanionsStore();
  const { t } = useTranslation();

  const RESPONSE_STYLE_OPTIONS: {
    value: ResponseStyle;
    label: string;
    hint: string;
  }[] = [
    {
      value: "concise",
      label: t("companions.settings.responseStyleConcise"),
      hint: t("companions.settings.responseStyleConciseHint"),
    },
    {
      value: "balanced",
      label: t("companions.settings.responseStyleBalanced"),
      hint: t("companions.settings.responseStyleBalancedHint"),
    },
    {
      value: "elaborate",
      label: t("companions.settings.responseStyleElaborate"),
      hint: t("companions.settings.responseStyleElaborateHint"),
    },
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[480px]">
            <Dialog.Title>{t("companions.settings.title")}</Dialog.Title>

            <div className="space-y-6">
              <div>
                <p className="mb-1 font-primary-bold text-sm text-font">
                  {t("companions.settings.displayNameLabel")}
                </p>
                <input
                  value={settings.userDisplayName}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      userDisplayName: e.target.value,
                    }))
                  }
                  aria-label={t("companions.settings.displayNameAria")}
                  className="w-full rounded-md border-none bg-background-input p-2.5 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
                />
              </div>

              <div>
                <p className="mb-1 font-primary-bold text-sm text-font">
                  {t("companions.settings.responseStyleLabel")}
                </p>
                <p className="mb-2 text-xs text-font-subtlest">
                  {t("companions.settings.responseStyleHint")}
                </p>
                <Select.Root
                  name="responseStyle"
                  value={settings.responseStyle}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      responseStyle: value as ResponseStyle,
                    }))
                  }
                >
                  <Select.Trigger
                    aria-label={t(
                      "companions.settings.openResponseStyleSelect"
                    )}
                  >
                    <Select.Value />
                    <Select.TriggerIcon />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                      {RESPONSE_STYLE_OPTIONS.map((option) => (
                        <Select.Item key={option.value} value={option.value}>
                          <Select.ItemIndicator />
                          <span>
                            <Select.ItemText>{option.label}</Select.ItemText>
                            <span className="block text-2xs text-font-subtlest">
                              {option.hint}
                            </span>
                          </span>
                        </Select.Item>
                      ))}
                      <Select.Separator />
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-primary-bold text-sm text-font">
                    {t("companions.settings.immersiveModeLabel")}
                  </p>
                  <p className="text-xs text-font-subtlest">
                    {t("companions.settings.immersiveModeHint")}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={settings.immersiveMode}
                  aria-label={t("companions.settings.toggleImmersiveMode")}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      immersiveMode: !prev.immersiveMode,
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.immersiveMode
                      ? "bg-background-brand-bold"
                      : "bg-background-neutral"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      settings.immersiveMode
                        ? "translate-x-[22px]"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className="mb-2 font-primary-bold text-sm text-font">
                  {t("companions.settings.languageLabel")}
                </p>
                <SelectLocale />
              </div>

              <div>
                <p className="mb-2 font-primary-bold text-sm text-font">
                  {t("companions.settings.themeLabel")}
                </p>
                <SelctTheme />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={onClose}
                aria-label={t("companions.settings.closeSettings")}
              >
                {t("common.done")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface CompanionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}
