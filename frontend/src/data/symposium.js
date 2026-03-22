export const SYMPOSIUM_INFO = {
  theme: 'Purple Shield',
  eventName: 'CYSTECH2K26',
  edition: '2K26',
  year: '2026',
  date: '08-04-2026',
  dateDisplay: '08 April 2026',
  eventDateISO: '2026-04-08T09:00:00+05:30',
  time: '9:00 AM to 3:30 PM',
  venue: 'ECE Block (2nd Floor)',
  campus: 'Dhanalakshmi College of Engineering (Manimangalam)',
  address: 'Dr. VPR Nagar, Manimangalam, Tambaram, Chennai-601301.',
  convenor: 'Mr Mohamed Abdhahir',
  coConvenor: '',
  staffCoordinator: 'Ms Pavithra R',
  studentOrganizer: 'Mohammed Anish B',
  studentOrganizerPhone: '9962675938',
}

export const EVENT_DAY_SCHEDULE = {
  '08 Apr': [
    {
      time: '09:00 AM',
      name: 'Inauguration',
      desc: 'Opening ceremony begins at the EEE auditorium for all participants.',
      tag: 'CEREMONY',
    },
    {
      time: '10:00 AM - 11:15 AM',
      name: 'Slot 1 Technical Events',
      desc: 'Payload Paradise & Neuro Byte begin.',
      tag: 'COMPETITION',
    },
    {
      time: '10:00 AM - 12:45 PM',
      name: 'Poster Presentation',
      desc: 'Cipher Vista presentations to the judges.',
      tag: 'COMPETITION',
    },
    {
      time: '08:30 AM - 03:00 PM',
      name: 'Kabaddi',
      desc: 'Kabaddi runs as an extended non-technical event block through the day.',
      tag: 'COMPETITION',
    },
    {
      time: '11:25 AM - 12:45 PM',
      name: 'Slot 2 Technical Events',
      desc: 'Bug Bash & Code 2 Chaos begin.',
      tag: 'COMPETITION',
    },
    {
      time: '12:45 PM - 01:30 PM',
      name: 'Lunch Break',
      desc: 'Food is provided for all registered participants.',
      tag: 'BREAK',
    },
    {
      time: '01:30 PM - 03:00 PM',
      name: 'Afternoon Non-Technical Events',
      desc: 'Link Logic, CINEATAKE, Free Fire, and BGMI are conducted in parallel.',
      tag: 'COMPETITION',
    },
    {
      time: '03:00 PM - 03:30 PM',
      name: 'Prize Distribution',
      desc: 'Certificates and prizes are distributed at the closing ceremony.',
      tag: 'CEREMONY',
    },
  ],
};

export const TIMELINE_SLOTS = [
  { event: 'Poster Presentation', slot1: '10:00am – 12:45pm (if possible)', slot2: '' },
  { event: 'Bug Bash', slot1: '', slot2: '11:25am – 12:45pm' },
  { event: 'Payload Paradise', slot1: '10:00am – 11:15am', slot2: '' },
  { event: 'Technical Quiz (Neuro Byte)', slot1: '10:00am – 11:15am', slot2: '' },
  { event: 'Fun Coding (Code 2 Chaos)', slot1: '', slot2: '11:25am – 12:45pm' },
  { isBreak: true, text: 'LUNCH BREAK 12:45pm to 1:30pm' },
  { event: 'Kabaddi', slot1: '8:30am – 3:00pm', slot2: '8:30am – 3:00pm' },
  { event: 'Link Logic', slot1: '1:30pm – 3:00pm', slot2: '1:30pm – 3:00pm' },
  { event: 'Short Film', slot1: '1:30pm – 3:00pm', slot2: '1:30pm – 3:00pm' },
  { event: 'Arena (BGMI & FF)', slot1: '1:30pm – 3:00pm', slot2: '1:30pm – 3:00pm' },
];