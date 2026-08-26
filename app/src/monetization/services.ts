// Swappable monetization seams.
//
// Real ads and payments need developer accounts and API keys that don't
// exist yet (AdMob, and RevenueCat / App Store Connect / Google Play /
// Stripe). Everything in the app talks to these interfaces, never to an
// SDK directly, so wiring the real providers later means writing one new
// implementation of each and swapping it in `getAdsService()` /
// `getPurchasesService()` — no screen changes.

export type AdSlot = 'reader-inline' | 'chapter-break' | 'browse-native' | 'rewarded';

export interface AdFill {
  /** Whether an ad is available to show in this slot right now. */
  filled: boolean;
  /** House-ad copy shown when there's no network fill. */
  headline?: string;
  advertiser?: string;
}

export interface AdsService {
  readonly providerName: string;
  /** True once a real network is configured; false for the house/no-op stub. */
  readonly isLive: boolean;
  requestAd(slot: AdSlot): Promise<AdFill>;
  /** Resolves true if the user watched a rewarded ad to completion. */
  showRewarded(): Promise<boolean>;
}

export type PlanId = 'lifetime' | 'monthly';

export interface Plan {
  id: PlanId;
  title: string;
  price: string;
  unit: string;
  note: string;
  tag?: string;
}

export interface PurchaseResult {
  ok: boolean;
  error?: string;
}

export interface PurchasesService {
  readonly providerName: string;
  readonly isLive: boolean;
  getPlans(): Plan[];
  purchase(plan: PlanId): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
}

// Pricing from chats/chat2.md: $15 one-time or $1/month.
const PLANS: Plan[] = [
  { id: 'lifetime', title: 'Lifetime', price: '$15', unit: 'once', note: 'Pay once, yours forever', tag: 'BEST VALUE' },
  { id: 'monthly', title: 'Monthly', price: '$1', unit: '/mo', note: 'Cancel anytime' },
];

/**
 * Stub ad network: never reports a paid fill, so slots render as house ads
 * with no tracking, no SDK, and no network calls. Swap for an AdMob-backed
 * implementation once you have a publisher account.
 */
class HouseAdsService implements AdsService {
  readonly providerName = 'House (no network)';
  readonly isLive = false;

  async requestAd(slot: AdSlot): Promise<AdFill> {
    if (slot === 'rewarded') return { filled: false };
    return { filled: false, headline: 'Your ad could be here', advertiser: 'MangaX house slot' };
  }

  async showRewarded(): Promise<boolean> {
    return false;
  }
}

/**
 * Stub billing: refuses purchases rather than pretending to succeed, so no
 * screen can mistake a stub for a real entitlement. Premium can still be
 * toggled locally for development (see useEntitlement).
 */
class StubPurchasesService implements PurchasesService {
  readonly providerName = 'None configured';
  readonly isLive = false;

  getPlans(): Plan[] {
    return PLANS;
  }

  async purchase(): Promise<PurchaseResult> {
    return {
      ok: false,
      error: 'Payments are not connected yet. Add a billing provider (RevenueCat, App Store, Play, or Stripe) to enable purchases.',
    };
  }

  async restore(): Promise<PurchaseResult> {
    return { ok: false, error: 'Nothing to restore — payments are not connected yet.' };
  }
}

let ads: AdsService = new HouseAdsService();
let purchases: PurchasesService = new StubPurchasesService();

export function getAdsService(): AdsService {
  return ads;
}
export function getPurchasesService(): PurchasesService {
  return purchases;
}

/** Call once at startup from a real provider integration. */
export function configureMonetization(next: { ads?: AdsService; purchases?: PurchasesService }) {
  if (next.ads) ads = next.ads;
  if (next.purchases) purchases = next.purchases;
}
