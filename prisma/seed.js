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

  const siteInfo = await prisma.siteInfo.upsert({
    where: { id: 1 },
    update: {}, 
    create: {
      aboutText: 'Este é o texto inicial sobre o CEEI. Edite-o no painel de administração!',
      contactPhone1: '(00) 00000-0000',
      contactPhone2: '(00) 11111-1111',
      contactEmail: 'contato.inicial@ceei.com.br',
    },
  });

  console.log('Informações do site criadas ou já existentes:', siteInfo);

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