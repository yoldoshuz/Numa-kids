/** Per-letter palette of the "витамины" wordmark, sampled from the Figma file. */
const LETTER_COLORS = [
  "#ec4869",
  "#ce54ad",
  "#c38b5a",
  "#b8a951",
  "#fda943",
  "#81b254",
  "#ad61a2",
  "#348fe1",
];

/**
 * Renders a word with every letter in its own brand colour. The word stays a
 * single accessible string — the colouring is applied to individual glyphs.
 */
export function RainbowWord({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {[...children].map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={{ color: LETTER_COLORS[index % LETTER_COLORS.length] }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
