import { prisma } from './db';

export type AdSlotConfig = {
  placementKey: string;
  adFormat: string;
  adUnitId: string;
  pageType: string;
};

/**
 * Ad placements are data, not code: this is what lets us move/disable
 * an ad unit from a dashboard/DB edit instead of a redeploy.
 * Cached per request-lifecycle; the ad_slots table changes rarely.
 */
export async function getAdSlots(pageType: string): Promise<AdSlotConfig[]> {
  const slots = await prisma.adSlot.findMany({
    where: { pageType, isActive: true },
  });
  return slots.map((s) => ({
    placementKey: s.placementKey,
    adFormat: s.adFormat,
    adUnitId: s.adUnitId,
    pageType: s.pageType,
  }));
}
