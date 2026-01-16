const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seed() {
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "admin123";

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingUser) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Admin user created");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
