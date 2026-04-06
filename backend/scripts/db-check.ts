import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const eventCount = await prisma.event.count();
  const participantCount = await prisma.participant.count();
  const registrationCount = await prisma.registration.count();
  
  console.log(`Event count: ${eventCount}`);
  console.log(`Participant count: ${participantCount}`);
  console.log(`Registration count: ${registrationCount}`);

  if (eventCount > 0) {
    const events = await prisma.event.findMany({
      select: { id: true, name: true, slug: true, isActive: true }
    });
    console.log('Events:', JSON.stringify(events, null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
