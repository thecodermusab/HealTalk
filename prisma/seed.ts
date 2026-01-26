import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/psyconnect?schema=public';
process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create hospitals
  const hospital1 = await prisma.hospital.create({
    data: {
      name: 'Acıbadem Hospital',
      location: 'Istanbul',
      address: 'Teşvikiye Mahallesi, Güzelbahçe Sk. No:20',
    },
  });

  const hospital2 = await prisma.hospital.create({
    data: {
      name: 'Memorial Hospital',
      location: 'Istanbul',
      address: 'Piyalepaşa Bulvarı, Okmeydanı',
    },
  });

  // Create psychologist user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const psychUser = await prisma.user.create({
    data: {
      name: 'Dr. Ahmet Yılmaz',
      email: 'ahmet@example.com',
      password: hashedPassword,
      role: 'PSYCHOLOGIST',
      psychologist: {
        create: {
          credentials: 'PhD, Clinical Psychologist',
          licenseNumber: 'PSY-12345-TR',
          experience: 12,
          bio: 'Licensed clinical psychologist with over 12 years of experience in treating anxiety disorders, depression, and trauma.',
          specializations: ['Anxiety Disorders', 'Depression', 'Trauma & PTSD'],
          price60: 45000, // $450 in cents
          price90: 65000, // $650 in cents
          rating: 4.8,
          reviewCount: 120,
          status: 'APPROVED',
          approvedAt: new Date(),
          hospitalId: hospital1.id,
        },
      },
    },
  });

  // Create patient user
  const patientUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'PATIENT',
      patient: {
        create: {},
      },
    },
  });

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      admin: {
        create: {},
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log({
    hospitals: [hospital1, hospital2],
    users: {
      psychologist: { email: 'ahmet@example.com', password: 'password123' },
      patient: { email: 'john@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
