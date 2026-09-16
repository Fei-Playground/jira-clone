import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdLanguage } from "react-icons/md";
import cx from "classix";
import { useTranslation } from "@app/store/locale.store";
import { Locale, locales, localeMeta } from "@app/locales";
import { Tooltip } from "@app/components/tooltip";

export const SelectLocale = (): JSX.Element => {
  const { locale, setLocale, t } = useTranslation();

  const selectLocale = (value: string): void => {
    setLocale(value as Locale);
  };

  return (
    <DropdownMenu.Root>
      <Tooltip title={t("header.selectLanguage")}>
        <DropdownMenu.Trigger
          aria-label={t("header.openLanguageSelect")}
          className="group flex h-[30px] w-[30px] rounded-full outline outline-2 outline-icon flex-center hover:bg-background-brand-subtlest hover:outline-border-brand"
        >
          <MdLanguage className="fill-icon group-hover:fill-icon-brand" />
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="z-50 origin-top-right rounded bg-elevation-surface-overlay p-3 text-font shadow-md radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up"
        >
          <DropdownMenu.Label className="select-none pb-2 text-lg">
            {t("header.selectLanguage")}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={locale}
            onValueChange={selectLocale}
            className="grid grid-cols-1 gap-2"
          >
            {locales.map((value) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className={cx(
                  "group flex min-w-[160px] items-center gap-3 rounded px-3 py-2 outline outline-2 hover:outline-border-brand",
                  value === locale
                    ? "bg-background-brand-subtlest text-font-brand outline-border-brand"
                    : "outline-transparent"
                )}
              >
                <span
                  className={cx(
                    "border-1 flex h-4 w-4 shrink-0 rounded-full border flex-center group-hover:border-border-brand",
                    value === locale
                      ? "border-border-brand"
                      : "border-border-disabled"
                  )}
                >
                  <span
                    className={cx(
                      "h-2 w-2 rounded-full bg-background-brand-bold",
                      value === locale ? "block" : "hidden"
                    )}
                  />
                </span>
                <span className="text-sm">{localeMeta[value].nativeLabel}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
