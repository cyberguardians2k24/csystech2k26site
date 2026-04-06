import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BASIC_PASS_INR = 149;

const events = [
  {
    name: 'Cipher Vista',
    slug: 'cipher-vista',
    description: 'Present a sharp cyber-tech idea with clarity and originality.',
    category: 'TECHNICAL',
    maxTeamSize: 3,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Bug Bash',
    slug: 'code-2-chaos',
    description: 'Multi-round debugging event focused on speed and accuracy.',
    category: 'CODING',
    maxTeamSize: 2,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Neuro Byte',
    slug: 'neuro-byte',
    description: 'Cyber-tech quiz rounds with online and offline stages.',
    category: 'KNOWLEDGE',
    maxTeamSize: 1,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Payload Paradise',
    slug: 'payload-paradise',
    description: 'Web vulnerability assessment in a controlled lab setup.',
    category: 'CODING',
    maxTeamSize: 4,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Code 2 Chaos',
    slug: 'design-duel',
    description: 'Three-round fun coding and problem solving challenge.',
    category: 'CODING',
    maxTeamSize: 2,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Arena (Free Fire)',
    slug: 'arena-free-fire',
    description: 'Custom-room Free Fire squad tournament.',
    category: 'SKILL',
    maxTeamSize: 4,
    registrationFeeInr: 199,
    prizeAmount: 'TBA',
  },
  {
    name: 'Arena (BGMI)',
    slug: 'arena-bgmi',
    description: 'Best-of-3 BGMI squad competition.',
    category: 'SKILL',
    maxTeamSize: 4,
    registrationFeeInr: 199,
    prizeAmount: 'TBA',
  },
  {
    name: 'Kabaddi',
    slug: 'kabaddi',
    description: 'On-ground kabaddi competition.',
    category: 'SKILL',
    maxTeamSize: 15,
    registrationFeeInr: 599,
    prizeAmount: '₹ 5,000',
  },
  {
    name: 'Link Logic',
    slug: 'link-logic',
    description: 'Team buzzer event across multiple rounds.',
    category: 'KNOWLEDGE',
    maxTeamSize: 4,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: 'TBA',
  },
  {
    name: 'Chess',
    slug: 'chess',
    description: 'An individual board game tournament evaluating tactical depth and strategic patience.',
    category: 'SKILL',
    maxTeamSize: 1,
    registrationFeeInr: BASIC_PASS_INR,
    prizeAmount: '₹ 3,000',
  },
];

async function main() {
  console.log('Seeding events...');
  
  for (const e of events) {
    const event = await prisma.event.upsert({
      where:  { slug: e.slug },
      update: {
        name: e.name,
        description: e.description,
        category: e.category as any,
        maxTeamSize: e.maxTeamSize,
        registrationFeeInr: e.registrationFeeInr,
        prizeAmount: e.prizeAmount,
        isActive: true,
      },
      create: {
        ...e,
        isActive: true,
      } as any,
    });
    console.log(`- ${event.name} (${event.slug})`);
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
