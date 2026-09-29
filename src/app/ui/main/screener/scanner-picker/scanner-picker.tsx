import { useState, useMemo } from "react";
import * as Dialog from "@app/components/dialog";
import { scannersByCategory, ScannerCategory, ScannerId, Market, MetricsById } from "@domain/market";
import { Button } from "@app/components/button";
import { ScannerCategorySection } from "./scanner-category-section";

const categoryOrder: ScannerCategory[] = ["quick", "leading", "momentum", "breakout", "gap", "trend", "pattern"];

export const ScannerPicker = ({
  markets,
  metricsById,
  activeScannerId,
  activeScannerLabel,
  onSelect,
}: ScannerPickerProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredByCategory = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result: Partial<Record<ScannerCategory, typeof scannersByCategory.quick>> = {};
    for (const category of categoryOrder) {
      const list = scannersByCategory[category] ?? [];
      const filtered = term
        ? list.filter((s) => s.label.toLowerCase().includes(term) || s.description.toLowerCase().includes(term))
        : list;
      if (filtered.length > 0) result[category] = filtered;
    }
    return result;
  }, [search]);

  const handleSelect = (id: ScannerId | undefined) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          color={activeScannerId ? "primary" : "neutral"}
          variant={activeScannerId ? "contained" : "subtlest"}
          aria-label="Open scanner catalog"
        >
          {activeScannerLabel ?? "Scanners"}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-h-[80vh] w-4/5 max-w-[560px] overflow-y-auto">
            <Dialog.Title>Scanners</Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose a named technical scanner to filter the market list.
            </Dialog.Description>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scanners..."
              aria-label="Search scanners"
              className="mb-4 w-full rounded border-none bg-background-input px-3 py-2 text-sm outline outline-2 outline-border-input focus:outline-border-brand"
            />
            {Object.keys(filteredByCategory).length === 0 && (
              <p className="text-sm text-font-subtlest">No scanners match &quot;{search}&quot;.</p>
            )}
            {categoryOrder.map((category) => {
              const scanners = filteredByCategory[category];
              if (!scanners) return null;
              return (
                <ScannerCategorySection
                  key={category}
                  category={category}
                  scanners={scanners}
                  markets={markets}
                  metricsById={metricsById}
                  activeScannerId={activeScannerId}
                  onSelect={handleSelect}
                />
              );
            })}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface ScannerPickerProps {
  markets: Market[];
  metricsById: MetricsById;
  activeScannerId: ScannerId | undefined;
  activeScannerLabel: string | undefined;
  onSelect: (id: ScannerId | undefined) => void;
}
