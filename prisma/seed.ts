// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@virtualhr.com';
  const plainPassword = 'Admin@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const hrUser = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: 'HR',
      isActive: true,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Admin',
          nic: '999999999V',
          joinedDate: new Date('2024-01-01'),
          designation: 'HR Manager',
          jobDescription: 'System-generated HR admin account',
        },
      },
    },
  });

  console.log('Seeded HR User:', hrUser.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
