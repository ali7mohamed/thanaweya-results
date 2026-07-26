import { getAdUnits } from '@/lib/adsterra';
import AdsterraUnit from './AdsterraUnit';

type Props = {
  /** How many ad blocks to stack here. */
  count: number;
  /** Vertical gap between units, in px. */
  gap?: number;
};

/**
 * A "wall" of Adsterra ads — cycles through every zone we have (leaderboard,
 * rectangle, native, skyscraper, mobile banners...) to reach `count` units.
 * Only 7 real zones exist, so above 7 the same zones repeat further down
 * the page.
 */
export default function AdsterraBreak({ count, gap = 16 }: Props) {
  const units = getAdUnits(count);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap, margin: '20px 0' }}>
      {units.map((unit, i) => (
        <AdsterraUnit key={i} unit={unit} />
      ))}
    </div>
  );
}
