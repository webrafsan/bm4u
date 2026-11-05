// Product slugs were shortened for cleaner URLs. The old slug of each product is kept here so
// next.config.ts can 301 it to the new one and src/lib/content.ts can normalise slugs that are
// still stored the old way in MongoDB. Keyed by product id.
export const SLUG_MAP: Record<string, { old: string; current: string }> = {
  'bm-2500': { old: 'buy-facebook-bm2500-premium-meta-business-manager', current: 'facebook-bm2500-business-manager' },
  'bm3-50': { old: 'bm3-restored-business-manager-50-limit-3-ads-ready', current: 'bm3-restored-business-manager-50-limit' },
  'bm3-250': { old: 'bm3-250-limit-reinstated-business-manager-3-ads-accounts', current: 'bm3-250-limit-reinstated-business-manager' },
  'bm0-bm1-old': { old: 'bm0-bm1-reinstated-business-manager-50-limit-create-2021-2022', current: 'bm0-bm1-reinstated-business-manager-2021-2022' },
  'bm-hold-agency': { old: 'reinstated-business-manager-cant-create-ads-acc-best-for-hold-agency-ads', current: 'reinstated-hold-business-manager-agency-ads' },
  'bm1-250-payup': { old: 'bm1-250-limit-reinstated-business-manager-pay-up-bm3', current: 'bm1-250-limit-reinstated-business-manager' },
  'bm5-super-strong': { old: 'super-strong-bm5-for-hold-page-pixel-share-share-agency-ads', current: 'bm5-business-manager-hold-page-pixel-share' },
  'bm10-250-verified': { old: 'bm10-250-limit-verified-business-manager-10-ads-created', current: 'bm10-250-limit-verified-business-manager' },
  'bm3-docs-verified-usa': { old: 'bm3-docs-verified-business-manager-usa-50-spending-limit', current: 'bm3-docs-verified-business-manager-usa' },
  'bm3-docs-verified-usa-4ads': { old: 'bm3-docs-verified-business-manager-usa-50-limit-4-ads-ready', current: 'bm3-docs-verified-business-manager-usa-4-ads' },
  'tiktok-usa-manual': { old: 'tiktok-ads-business-verified-country-usa-manual-payment', current: 'tiktok-ads-account-usa-manual-payment' },
  'acc-2line-random': { old: 'account-2-line-reinstated-random-country-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-2-line-facebook-account-random-country' },
  'acc-3line-1000xx': { old: 'account-3-line-reinstated-uid-1000xx-random-country-full-2fa-password-changeable', current: 'reinstated-3-line-facebook-account-uid-1000xx' },
  'acc-3line-usa': { old: 'account-3-line-reinstated-usa-stock-2007-2024-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-usa' },
  'acc-3line-uk': { old: 'account-3-line-reinstated-uk-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-uk' },
  'acc-3line-bd': { old: 'account-3-line-reinstated-bangladesh-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-bangladesh' },
  'acc-3line-australia': { old: 'account-3-line-reinstated-australian-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-australia' },
  'acc-3line-germany': { old: 'account-3-line-reinstated-germany-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-germany' },
  'acc-3line-france': { old: 'account-3-line-reinstated-france-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-france' },
  'acc-3line-hongkong': { old: 'account-3-line-reinstated-hong-kong-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-hong-kong' },
  'acc-3line-algeria': { old: 'account-3-line-reinstated-algeria-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-algeria' },
  'acc-3line-cameroon': { old: 'account-3-line-reinstated-cameroon-stock-2007-2024-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-cameroon' },
  'acc-3line-poland': { old: 'account-3-line-reinstated-poland-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-poland' },
  'acc-3line-spain': { old: 'account-3-line-reinstated-spain-stock-2007-2024-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-spain' },
  'acc-3line-cambodia': { old: 'account-3-line-reinstated-cambodia-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-cambodia' },
  'acc-3line-pakistan': { old: 'account-3-line-reinstated-pakistan-stock-live-ads-full-2fa-cp-mail', current: 'reinstated-3-line-facebook-account-pakistan' },
};

export const SLUG_REDIRECTS = Object.values(SLUG_MAP).map(({ old, current }) => ({
  source: `/product/${old}`,
  destination: `/product/${current}`,
  permanent: true,
}));
