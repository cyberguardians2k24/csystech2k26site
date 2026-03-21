// Event ID/slug -> WhatsApp group URL
// Shown only after successful registration.

export const WHATSAPP_GROUPS = {
  'neuro-byte': 'https://chat.whatsapp.com/KWVZCtEYRowAfRdbIevg3D',
  'arena-bgmi': 'https://chat.whatsapp.com/FFgDaHZlS3f0DRwcAbYpao',
  'cipher-vista': 'https://chat.whatsapp.com/G0p1xjYNVJu6eUmIC0TdkB',
  'payload-paradise': 'https://chat.whatsapp.com/Jcc13psuZQo1NjqYuGux4x',
  'arena-free-fire': 'https://chat.whatsapp.com/DheZWPCZ0xOId5UdulIrzC',
  'design-duel': 'https://chat.whatsapp.com/D2E8ZxC3eKdBnAz48zw4kS',
  'bug-bash': 'https://chat.whatsapp.com/DQ1Icj8ytbWAymdUMWpH8d',
  kabaddi: 'https://chat.whatsapp.com/LVfrFQv5iK44T7wx6WPGOJ',
  'link-logic': 'https://chat.whatsapp.com/JhWxwMmWLiPHrn9LjuWL6Q',
};

export function getWhatsAppGroupLink(eventIdOrSlug) {
  const key = String(eventIdOrSlug ?? '').trim().toLowerCase();
  return WHATSAPP_GROUPS[key] || null;
}
