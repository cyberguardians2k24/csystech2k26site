export const SPONSOR_TIERS = [
  {
    tier: 'Title Sponsor',
    color: 'from-vibranium-dark/25 to-vibranium/10',
    border: 'border-vibranium/60',
    glow: 'shadow-[0_0_30px_rgba(196, 30, 58,0.7)] vibranium-glow',
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
    color: 'from-vibranium-gold/10 to-vibranium-gold/5',
    border: 'border-vibranium-gold/20',
    glow: 'shadow-[0_0_20px_rgba(255, 215, 0,0.1)]',
    text: 'text-vibranium-gold',
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
