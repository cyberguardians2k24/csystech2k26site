export const SPONSOR_TIERS = [
  {
    tier: 'Title Sponsor',
    color: 'from-vibranium-dark/25 to-vibranium/10',
    border: 'border-vibranium/60',
    glow: 'shadow-[0_0_30px_rgba(157,0,255,0.7)] vibranium-glow',
    text: 'bp-vibranium-text',
    sponsors: [],
  },
  {
    tier: 'Gold Sponsors',
    color: 'from-vibranium/15 to-vibranium/5',
    border: 'border-vibranium/30',
    glow: 'shadow-vibranium-glow',
    text: 'text-vibranium-light',
    sponsors: [],
  },
  {
    tier: 'Silver Sponsors',
    color: 'from-holo-cyan/10 to-holo-cyan/5',
    border: 'border-holo-cyan/20',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.1)]',
    text: 'text-holo-cyan',
    sponsors: [],
  },
  {
    tier: 'Community Partners',
    color: 'from-white/5 to-white/[0.02]',
    border: 'border-white/10',
    glow: '',
    text: 'text-white/40',
    sponsors: [],
  },
];

export function countSponsors(tiers = SPONSOR_TIERS) {
  return tiers.reduce((sum, tier) => sum + (tier.sponsors?.length ?? 0), 0);
}
