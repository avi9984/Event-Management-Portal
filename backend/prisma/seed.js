import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("Admin@123", 10);

    await prisma.user.upsert({
        where: {
            username: "admin",
        },
        update: {},
        create: {
            username: "admin",
            password,
            role: "ADMIN",
        },
    });

    console.log("Admin created");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });