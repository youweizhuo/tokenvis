const palette = [
  { base: "#6b8afd", dark: "#3b5bcc" },
  { base: "#f29d9d", dark: "#d96c6c" },
  { base: "#8bd3c7", dark: "#49a293" },
  { base: "#f2c48d", dark: "#d99b4f" },
  { base: "#c2a2ff", dark: "#8c6fe0" },
  { base: "#7ad0ff", dark: "#3ea5d9" },
];

export function agentColor(agentId: string) {
  const idx =
    agentId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    palette.length;
  return palette[idx];
}

/**
 * Convert hex color to OKLCH-based gradient CSS.
 * Creates a gradient from the base color to a lighter tint.
 */
export function agentGradient(agentId: string): string {
  const colors = agentColor(agentId);
  // Use CSS relative color syntax with OKLCH for modern gradient
  // Fallback: simple linear gradient from base to lighter version
  return `linear-gradient(135deg, ${colors.base} 0%, ${lightenHex(colors.base, 0.85)} 100%)`;
}

/**
 * Lighten a hex color by mixing with white.
 * @param hex - Hex color string (e.g., "#6b8afd")
 * @param lightness - How much to lighten (0 = no change, 1 = white)
 */
function lightenHex(hex: string, lightness: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.round(r + (255 - r) * lightness);
  const newG = Math.round(g + (255 - g) * lightness);
  const newB = Math.round(b + (255 - b) * lightness);
  
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

