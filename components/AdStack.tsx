import AdSlot from './AdSlot';
import { findAdUnitId, type AdSlotConfig } from '@/lib/ads';

type Format = 'leaderboard' | 'rectangle' | 'multiplex' | 'in-feed' | 'responsive' | 'anchor';

type Props = {
  /** Base placement key, e.g. "home_mid". Slot 1 keeps this exact key; slot 2+ becomes "home_mid_2", etc. */
  baseId: string;
  /** The ad_slots rows fetched for this page (via getAdSlots(pageType)) — used to look up real ad-unit IDs. */
  adSlots: AdSlotConfig[];
  /** How many ad units to stack in this spot. Default 3. */
  count?: number;
  /** Format for each slot in order (repeats if count > formats.length). */
  formats?: Format[];
  /** Vertical gap between stacked units, in px. */
  gap?: number;
};

/**
 * Stacks multiple AdSlot units one under another in the same section.
 * NOTE (worth keeping in mind, not a blocker): stacking several ad units back-to-back
 * with little content between them raises AdSense's "ad density" flags if pushed too
 * far — this component just renders whatever count you ask for, so keep an eye on
 * AdSense Policy Center after publishing a new stack.
 */
export default function AdStack({ baseId, adSlots, count = 3, formats, gap = 14 }: Props) {
  const seq: Format[] = formats ?? ['responsive', 'rectangle', 'in-feed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => {
        const placementKey = i === 0 ? baseId : `${baseId}_${i + 1}`;
        return <AdSlot key={i} format={seq[i % seq.length]} adUnitId={findAdUnitId(adSlots, placementKey)} />;
      })}
    </div>
  );
}
