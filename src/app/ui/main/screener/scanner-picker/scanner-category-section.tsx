import { Scanner, ScannerId, ScannerCategory, categoryDict, Market, MetricsById, applyScanner } from "@domain/market";
import { ScannerItem } from "./scanner-item";

export const ScannerCategorySection = ({
  category,
  scanners,
  markets,
  metricsById,
  activeScannerId,
  onSelect,
}: ScannerCategorySectionProps): JSX.Element => {
  const info = categoryDict[category];

  return (
    <div className="mb-3">
      <p className="mb-1 flex items-center gap-1.5 px-3 text-2xs uppercase text-font-subtlest">
        <span>{info.icon}</span>
        {info.label}
      </p>
      <div role="radiogroup" aria-label={info.label} className="flex flex-col">
        {scanners.map((scanner) => {
          const matchCount =
            markets[0]?.listedDaysAgo === undefined
              ? 0
              : applyScanner(markets, metricsById, scanner).length;
          return (
            <ScannerItem
              key={scanner.id}
              scanner={scanner}
              matchCount={matchCount}
              isActive={activeScannerId === scanner.id}
              onSelect={() => onSelect(activeScannerId === scanner.id ? undefined : scanner.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ScannerCategorySectionProps {
  category: ScannerCategory;
  scanners: Scanner[];
  markets: Market[];
  metricsById: MetricsById;
  activeScannerId: ScannerId | undefined;
  onSelect: (id: ScannerId | undefined) => void;
}
