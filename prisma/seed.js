// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const masterUserLogin = '23984716';

  const masterUserPassword = 'change-this-super-secret-password';

  const hashedPassword = await bcrypt.hash(masterUserPassword, 10);

  const masterUser = await prisma.user.upsert({
    where: { login: masterUserLogin },
    update: {},
    create: {
      name: 'CEEI',
      login: masterUserLogin,
      password: hashedPassword,
      birthDate: new Date('1970-01-01'),
      role: 'MASTER',
    },
  });

  console.log('Super Usuário criado ou já existente:', masterUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });