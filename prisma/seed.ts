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

  const normalizeEmail = (email: string) => email.trim().toLowerCase();
  const psychPlain = process.env.PSYCHOLOGIST_PASSWORD || "password123";
  const patientPlain = process.env.PATIENT_PASSWORD || "password123";
  const adminPlain = process.env.ADMIN_PASSWORD || "password123";
  const psychEmail = normalizeEmail(
    process.env.PSYCHOLOGIST_EMAIL || "ahmet@example.com"
  );
  const patientEmail = normalizeEmail(
    process.env.PATIENT_EMAIL || "john@example.com"
  );
  const adminEmail = normalizeEmail(
    process.env.ADMIN_EMAIL || "admin@example.com"
  );

  // Create psychologist user
  const psychHashedPassword = await bcrypt.hash(psychPlain, 10);

  const psychUser = await prisma.user.create({
    data: {
      name: 'Dr. Ahmet Yılmaz',
      email: psychEmail,
      password: psychHashedPassword,
      role: 'PSYCHOLOGIST',
      emailVerified: new Date(),
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
  const patientHashedPassword = await bcrypt.hash(patientPlain, 10);
  const patientUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: patientEmail,
      password: patientHashedPassword,
      role: 'PATIENT',
      emailVerified: new Date(),
      patient: {
        create: {},
      },
    },
  });

  // Create admin user
  const adminHashedPassword = await bcrypt.hash(adminPlain, 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: adminEmail,
      password: adminHashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      admin: {
        create: {},
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log({
    hospitals: [hospital1, hospital2],
    users: {
      psychologist: { email: psychEmail, password: psychPlain },
      patient: { email: patientEmail, password: patientPlain },
      admin: { email: adminEmail, password: adminPlain },
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
