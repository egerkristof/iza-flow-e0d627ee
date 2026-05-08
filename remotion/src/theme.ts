import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const C = {
  bg: "#FBFBFD",
  card: "#FFFFFF",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",
  text: "#0B1220",
  textMuted: "#5B6473",
  textSubtle: "#8A93A2",
  primary: "#1F8FCC",       // cyan
  primarySoft: "#E8F4FB",
  primaryRing: "rgba(31,143,204,0.30)",
  green: "#1FA56C",
  greenSoft: "#E6F6EE",
  red: "#D24B4B",
  redSoft: "#FBE9E9",
  amber: "#D89A1F",
};