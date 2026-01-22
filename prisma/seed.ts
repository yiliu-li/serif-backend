import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const code = 'ADMIN-SETUP';
  const exists = await prisma.invitationCode.findUnique({ where: { code } });
  if (!exists) {
    await prisma.invitationCode.create({
      data: { code },
    });
    console.log(`Created initial invitation code: ${code}`);
  } else {
    console.log(`Invitation code ${code} already exists`);
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
