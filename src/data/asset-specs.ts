import type { StoreAssetSpec } from '@/types/asset'

export const STORE_ASSET_SPECS: StoreAssetSpec[] = [
  // ── Google Play ──
  {
    id: 'gp-feature',
    platform: 'googlePlay',
    category: 'marketing',
    name: 'Feature Graphic',
    nameKey: 'asset.spec.gpFeature',
    width: 1024,
    height: 500,
    required: true,
    description: 'Main promotional banner on Google Play listing',
  },
  {
    id: 'gp-phone',
    platform: 'googlePlay',
    category: 'screenshot',
    name: 'Phone Screenshot',
    nameKey: 'asset.spec.gpPhone',
    width: 1080,
    height: 1920,
    required: true,
    description: 'Phone screenshot (min 2, max 8)',
  },
  {
    id: 'gp-tablet7',
    platform: 'googlePlay',
    category: 'screenshot',
    name: 'Tablet 7" Screenshot',
    nameKey: 'asset.spec.gpTablet7',
    width: 1200,
    height: 1920,
    required: false,
    description: '7-inch tablet screenshot',
  },
  {
    id: 'gp-tablet10',
    platform: 'googlePlay',
    category: 'screenshot',
    name: 'Tablet 10" Screenshot',
    nameKey: 'asset.spec.gpTablet10',
    width: 1600,
    height: 2560,
    required: false,
    description: '10-inch tablet screenshot',
  },
  {
    id: 'gp-tv',
    platform: 'googlePlay',
    category: 'marketing',
    name: 'TV Banner',
    nameKey: 'asset.spec.gpTv',
    width: 1280,
    height: 720,
    required: false,
    description: 'Android TV banner image',
  },

  // ── Apple App Store ──
  {
    id: 'as-iphone67',
    platform: 'appStore',
    category: 'screenshot',
    name: 'iPhone 6.7" Screenshot',
    nameKey: 'asset.spec.asIphone67',
    width: 1290,
    height: 2796,
    required: true,
    description: 'iPhone 14 Pro Max / 15 Pro Max',
  },
  {
    id: 'as-iphone65',
    platform: 'appStore',
    category: 'screenshot',
    name: 'iPhone 6.5" Screenshot',
    nameKey: 'asset.spec.asIphone65',
    width: 1284,
    height: 2778,
    required: false,
    description: 'iPhone 12 Pro Max / 13 Pro Max / 14 Plus',
  },
  {
    id: 'as-iphone55',
    platform: 'appStore',
    category: 'screenshot',
    name: 'iPhone 5.5" Screenshot',
    nameKey: 'asset.spec.asIphone55',
    width: 1242,
    height: 2208,
    required: false,
    description: 'iPhone 6s Plus / 7 Plus / 8 Plus',
  },
  {
    id: 'as-ipad129',
    platform: 'appStore',
    category: 'screenshot',
    name: 'iPad 12.9" Screenshot',
    nameKey: 'asset.spec.asIpad129',
    width: 2048,
    height: 2732,
    required: false,
    description: 'iPad Pro 12.9-inch',
  },

  // ── General / Cross-platform ──
  {
    id: 'gen-promo-wide',
    platform: 'general',
    category: 'marketing',
    name: 'Promo Banner (Wide)',
    nameKey: 'asset.spec.genPromoWide',
    width: 1920,
    height: 1080,
    required: false,
    description: 'Wide promotional banner for social media / web',
  },
  {
    id: 'gen-promo-square',
    platform: 'general',
    category: 'marketing',
    name: 'Promo Banner (Square)',
    nameKey: 'asset.spec.genPromoSquare',
    width: 1080,
    height: 1080,
    required: false,
    description: 'Square promotional banner for Instagram / social',
  },
]

/** Get specs filtered by platform */
export function getSpecsByPlatform(platform: StoreAssetSpec['platform']) {
  return STORE_ASSET_SPECS.filter((s) => s.platform === platform)
}

/** Get specs filtered by category */
export function getSpecsByCategory(category: StoreAssetSpec['category']) {
  return STORE_ASSET_SPECS.filter((s) => s.category === category)
}
