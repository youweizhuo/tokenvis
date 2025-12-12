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

