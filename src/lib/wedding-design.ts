export const WEDDING_PALETTES = {
  sage: {
    label: "Garden sage",
    accent: "#405242",
    highlight: "#b86449",
    paper: "#fbf8f2",
    soft: "#ebece3",
    card: "#fffcf7",
    ink: "#332821",
    overlay: "rgba(24, 46, 37, .44)",
    gradient:
      "linear-gradient(180deg, rgba(24, 46, 37, .12), rgba(24, 46, 37, .72))",
  },
  rose: {
    label: "Rosewater",
    accent: "#87535a",
    highlight: "#ad6e6f",
    paper: "#fff7f6",
    soft: "#f4e5e4",
    card: "#fffdfc",
    ink: "#38282b",
    overlay: "rgba(60, 32, 38, .42)",
    gradient:
      "linear-gradient(180deg, rgba(60, 32, 38, .10), rgba(60, 32, 38, .72))",
  },
  ocean: {
    label: "Coastal blue",
    accent: "#2f5964",
    highlight: "#a06f56",
    paper: "#f5faf9",
    soft: "#dfecea",
    card: "#ffffff",
    ink: "#23383d",
    overlay: "rgba(22, 47, 57, .43)",
    gradient:
      "linear-gradient(180deg, rgba(22, 47, 57, .10), rgba(22, 47, 57, .76))",
  },
  midnight: {
    label: "Midnight velvet",
    accent: "#30334a",
    highlight: "#b58e55",
    paper: "#f8f7f4",
    soft: "#e8e6e0",
    card: "#fffdfa",
    ink: "#292a34",
    overlay: "rgba(21, 22, 35, .48)",
    gradient:
      "linear-gradient(180deg, rgba(21, 22, 35, .08), rgba(21, 22, 35, .78))",
  },
  terracotta: {
    label: "Sunset terracotta",
    accent: "#914d3d",
    highlight: "#b47d4d",
    paper: "#fff8f2",
    soft: "#f1e3d8",
    card: "#fffdfa",
    ink: "#3b2b25",
    overlay: "rgba(58, 31, 24, .42)",
    gradient:
      "linear-gradient(180deg, rgba(58, 31, 24, .08), rgba(58, 31, 24, .74))",
  },
  lavender: {
    label: "Lavender dusk",
    accent: "#685477",
    highlight: "#b28b6b",
    paper: "#faf7fc",
    soft: "#ece4f1",
    card: "#fffdfd",
    ink: "#342b3b",
    overlay: "rgba(43, 31, 53, .44)",
    gradient:
      "linear-gradient(180deg, rgba(43, 31, 53, .10), rgba(43, 31, 53, .76))",
  },
} as const;

export type WeddingPalette = keyof typeof WEDDING_PALETTES;
export type WeddingTypography = "editorial" | "modern" | "romantic";
export type WeddingLayout = "classic" | "editorial" | "minimal";
export type WeddingHeroStyle = "photo" | "solid";
export type WeddingCoverPosition = "center" | "top" | "bottom";

export type WeddingDesign = {
  palette: WeddingPalette;
  typography: WeddingTypography;
  layout: WeddingLayout;
  heroStyle: WeddingHeroStyle;
  coverPosition: WeddingCoverPosition;
  showStory: boolean;
  showSchedule: boolean;
  showVenue: boolean;
  showRsvpButton: boolean;
  welcomeMessage: string;
  storyLabel: string;
  scheduleLabel: string;
  rsvpLabel: string;
  closingMessage: string;
};

export const DEFAULT_WEDDING_DESIGN: WeddingDesign = {
  palette: "sage",
  typography: "editorial",
  layout: "classic",
  heroStyle: "photo",
  coverPosition: "center",
  showStory: true,
  showSchedule: true,
  showVenue: true,
  showRsvpButton: true,
  welcomeMessage: "Together with our favorite people",
  storyLabel: "A note from us",
  scheduleLabel: "The day at a glance",
  rsvpLabel: "Find your invitation",
  closingMessage: "See you on the dance floor.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  choices: T,
): value is T[number] {
  return typeof value === "string" && choices.includes(value);
}

const palettes = Object.keys(WEDDING_PALETTES) as WeddingPalette[];
const typographies: WeddingTypography[] = ["editorial", "modern", "romantic"];
const layouts: WeddingLayout[] = ["classic", "editorial", "minimal"];
const heroStyles: WeddingHeroStyle[] = ["photo", "solid"];
const coverPositions: WeddingCoverPosition[] = ["center", "top", "bottom"];
const sectionToggles = [
  "showStory",
  "showSchedule",
  "showVenue",
  "showRsvpButton",
] as const;

/** Strict validation for values submitted to the authenticated API. */
export function validateWeddingDesign(value: unknown): WeddingDesign | null {
  if (!isRecord(value)) return null;
  if (!isOneOf(value.palette, palettes)) return null;
  if (!isOneOf(value.typography, typographies)) return null;
  if (!isOneOf(value.layout, layouts)) return null;
  if (!isOneOf(value.heroStyle, heroStyles)) return null;
  if (!isOneOf(value.coverPosition, coverPositions)) return null;
  if (sectionToggles.some((key) => typeof value[key] !== "boolean"))
    return null;
  const copyLimits = {
    welcomeMessage: 100,
    storyLabel: 60,
    scheduleLabel: 60,
    rsvpLabel: 60,
    closingMessage: 120,
  } as const;
  for (const [key, maxLength] of Object.entries(copyLimits)) {
    if (typeof value[key] !== "string" || value[key].length > maxLength)
      return null;
  }

  return {
    palette: value.palette,
    typography: value.typography,
    layout: value.layout,
    heroStyle: value.heroStyle,
    coverPosition: value.coverPosition,
    showStory: value.showStory as boolean,
    showSchedule: value.showSchedule as boolean,
    showVenue: value.showVenue as boolean,
    showRsvpButton: value.showRsvpButton as boolean,
    welcomeMessage:
      (value.welcomeMessage as string).trim() ||
      DEFAULT_WEDDING_DESIGN.welcomeMessage,
    storyLabel:
      (value.storyLabel as string).trim() || DEFAULT_WEDDING_DESIGN.storyLabel,
    scheduleLabel:
      (value.scheduleLabel as string).trim() ||
      DEFAULT_WEDDING_DESIGN.scheduleLabel,
    rsvpLabel:
      (value.rsvpLabel as string).trim() || DEFAULT_WEDDING_DESIGN.rsvpLabel,
    closingMessage:
      (value.closingMessage as string).trim() ||
      DEFAULT_WEDDING_DESIGN.closingMessage,
  };
}

/** Safe fallback for older Firestore records that predate the design editor. */
export function readWeddingDesign(value: unknown): WeddingDesign {
  return validateWeddingDesign(value) ?? DEFAULT_WEDDING_DESIGN;
}
