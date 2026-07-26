import AdSlot from './AdSlot';

type Format = 'leaderboard' | 'rectangle' | 'multiplex' | 'in-feed' | 'responsive' | 'anchor';

type Props = {
  /** Base placement key, e.g. "home_mid". Slot 1 keeps this exact key; slot 2+ becomes "home_mid_2", etc. */
  baseId: string;
  /** How many ad units to stack in this spot. Default 3. */
  count?: number;
  /** Format for each slot in order (repeats if count > formats.length). */
  formats?: Format[];
  /** Vertical gap between stacked units, in px. */
  gap?: number;
};

/**
 * Stacks multiple AdSlot units one under another in the same section.
 * Each AdSlot renders in its own isolated iframe (see AdSlot.tsx), so stacking
 * repeats of the same format/zone here is safe — this component just renders
 * whatever count you ask for; keep an eye on how dense a page feels if you push
 * the count up, since that's a UX call more than a technical one now.
 */
export default function AdStack({ baseId, count = 3, formats, gap = 14 }: Props) {
  const seq: Format[] = formats ?? ['responsive', 'rectangle', 'in-feed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <AdSlot key={i} format={seq[i % seq.length]} adUnitId={i === 0 ? baseId : `${baseId}_${i + 1}`} />
      ))}
    </div>
  );
}
