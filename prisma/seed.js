const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial certificates to Prisma Postgres...');

    const sample1 = {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        enrollmentNo: 'KIMT-2026-001',
        course: 'Master Website Development with AI',
        issueDate: '2026-03-15',
        photo: 'https://images.unsplash.com/photo-1589330694653-dad6d3240e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    };

    const sample2 = {
        name: 'Priya Verma',
        phone: '+91 98123 45678',
        enrollmentNo: 'KIMT-2026-002',
        course: 'Python & AI Prompt Engineering',
        issueDate: '2026-04-10',
        photo: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    };

    await prisma.certificate.upsert({
        where: { enrollmentNo: sample1.enrollmentNo },
        update: sample1,
        create: sample1
    });

    await prisma.certificate.upsert({
        where: { enrollmentNo: sample2.enrollmentNo },
        update: sample2,
        create: sample2
    });

    // Also seed default admin
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: { password: 'admin12345' },
        create: { username: 'admin', password: 'admin12345' }
    });

    console.log('Successfully seeded certificates and admin credentials into Prisma Postgres!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
