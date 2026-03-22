// Event ID/slug -> WhatsApp group URL
// Shown only after successful registration.

export const WHATSAPP_GROUPS = {
  'neuro-byte': 'https://chat.whatsapp.com/Byw6UAj76uW37yXP7XwVhs?mode=gi_t',
  'arena-bgmi': 'https://chat.whatsapp.com/CXMkqbcmzEvH0sch7igiBQ?mode=hqctswa',
  'cipher-vista': 'https://chat.whatsapp.com/HwC2EjzL6TpFajaGpx38y1?mode=gi_t',
  'payload-paradise': 'https://chat.whatsapp.com/FL6fr97E2ASKDpYT2Kwfgb?mode=gi_t',
  'arena-free-fire': 'https://chat.whatsapp.com/Lssq5SgUQitJ14caKCivyD?mode=gi_t',
  'design-duel': 'https://chat.whatsapp.com/D2E8ZxC3eKdBnAz48zw4kS',
  'code-2-chaos': 'https://chat.whatsapp.com/HUogqOifgX5HzBQ8xCh11u?mode=gi_t',
  'kabaddi': 'https://chat.whatsapp.com/LhE9Byp2YIiBTffJIioSlg?mode=gi_t',
  'link-logic': 'https://chat.whatsapp.com/DUHqjOXE7qY7Ksevpj6STd?mode=gi_t',
  'short-film': 'https://chat.whatsapp.com/H5OYfQBOPhRC8VSGf2cnpY?mode=gi_t',
};

export function getWhatsAppGroupLink(eventIdOrSlug) {
  const key = String(eventIdOrSlug ?? '').trim().toLowerCase();
  return WHATSAPP_GROUPS[key] || null;
}
