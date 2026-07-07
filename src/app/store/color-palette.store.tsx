import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface ColorPalette {
  // App-level colors
  backgroundColor: string; // body/main background
  navbarColor: string; // top header/navbar background
  headerColor: string; // section header (project title bar area)

  // Board column colors
  columnTodo: string;
  columnInProgress: string;
  columnDone: string;

  // Priority colors for issue cards
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
}

export const DEFAULT_PALETTE: ColorPalette = {
  backgroundColor: "#f1f2f4",
  navbarColor: "#ffffff",
  headerColor: "#f7f8f9",
  columnTodo: "#f1f2f4",
  columnInProgress: "#f1f2f4",
  columnDone: "#f1f2f4",
  priorityLow: "#22a06b",
  priorityMedium: "#e2b203",
  priorityHigh: "#e34935",
};

// Named preset palettes
export const PALETTE_PRESETS: { name: string; palette: ColorPalette }[] = [
  {
    name: "Default",
    palette: DEFAULT_PALETTE,
  },
  {
    name: "Ocean",
    palette: {
      backgroundColor: "#0a1929",
      navbarColor: "#0d2137",
      headerColor: "#102a43",
      columnTodo: "#102a43",
      columnInProgress: "#0d2137",
      columnDone: "#0a1929",
      priorityLow: "#00b4d8",
      priorityMedium: "#48cae4",
      priorityHigh: "#ef233c",
    },
  },
  {
    name: "Forest",
    palette: {
      backgroundColor: "#1a2e1a",
      navbarColor: "#1e3a1e",
      headerColor: "#234023",
      columnTodo: "#234023",
      columnInProgress: "#1e3a1e",
      columnDone: "#1a2e1a",
      priorityLow: "#57cc99",
      priorityMedium: "#f4d03f",
      priorityHigh: "#e74c3c",
    },
  },
  {
    name: "Sunset",
    palette: {
      backgroundColor: "#fff4e6",
      navbarColor: "#ffe8cc",
      headerColor: "#ffd9b3",
      columnTodo: "#ffd9b3",
      columnInProgress: "#ffcc99",
      columnDone: "#ffbe80",
      priorityLow: "#2ecc71",
      priorityMedium: "#f39c12",
      priorityHigh: "#c0392b",
    },
  },
  {
    name: "Midnight",
    palette: {
      backgroundColor: "#0d0d0d",
      navbarColor: "#1a1a1a",
      headerColor: "#262626",
      columnTodo: "#1a1a1a",
      columnInProgress: "#1f1f1f",
      columnDone: "#141414",
      priorityLow: "#00ff87",
      priorityMedium: "#ffd60a",
      priorityHigh: "#ff0060",
    },
  },
];

const STORAGE_KEY = "jira-clone-color-palette";

type ColorPaletteContextType = {
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
  updateColor: (key: keyof ColorPalette, value: string) => void;
  resetToDefault: () => void;
  applyPreset: (preset: ColorPalette) => void;
};

const ColorPaletteContext = createContext<ColorPaletteContextType | null>(null);

const loadFromStorage = (): ColorPalette => {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PALETTE;
    return { ...DEFAULT_PALETTE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PALETTE;
  }
};

export const ColorPaletteProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [palette, setPaletteState] = useState<ColorPalette>(() => loadFromStorage());

  // Apply CSS variables whenever palette changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--custom-bg", palette.backgroundColor);
    root.style.setProperty("--custom-navbar", palette.navbarColor);
    root.style.setProperty("--custom-header", palette.headerColor);
    root.style.setProperty("--custom-col-todo", palette.columnTodo);
    root.style.setProperty("--custom-col-in-progress", palette.columnInProgress);
    root.style.setProperty("--custom-col-done", palette.columnDone);
    root.style.setProperty("--custom-priority-low", palette.priorityLow);
    root.style.setProperty("--custom-priority-medium", palette.priorityMedium);
    root.style.setProperty("--custom-priority-high", palette.priorityHigh);
  }, [palette]);

  const setPalette = useCallback((newPalette: ColorPalette) => {
    setPaletteState(newPalette);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPalette));
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const updateColor = useCallback(
    (key: keyof ColorPalette, value: string) => {
      setPalette({ ...palette, [key]: value });
    },
    [palette, setPalette]
  );

  const resetToDefault = useCallback(() => {
    setPalette(DEFAULT_PALETTE);
  }, [setPalette]);

  const applyPreset = useCallback(
    (preset: ColorPalette) => {
      setPalette(preset);
    },
    [setPalette]
  );

  return (
    <ColorPaletteContext.Provider
      value={{ palette, setPalette, updateColor, resetToDefault, applyPreset }}
    >
      {children}
    </ColorPaletteContext.Provider>
  );
};

export const useColorPalette = (): ColorPaletteContextType => {
  const ctx = useContext(ColorPaletteContext);
  if (!ctx) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider");
  }
  return ctx;
};
