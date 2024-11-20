const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const migratePasswords = async () => {
    try {
        const users = await prisma.user.findMany();

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                },
            });

            console.log(`Usuario ${user.email} migrado con contraseña hasheada.`);
        }

        console.log("Migración completada.");
    } catch (error) {
        console.error("Error durante la migración:", error);
    } finally {
        await prisma.$disconnect();
    }
};

migratePasswords();
