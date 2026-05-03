import { db } from './db';
import { users, majors as majorsTable, classes as classesTable } from '@guru-pintar/types/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create Superadmin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  try {
    await db.insert(users).values({
      name: 'Super Admin',
      email: 'admin@gurupintar.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Superadmin created successfully!');
    console.log('📧 Email: admin@gurupintar.com');
    console.log('🔑 Password: admin123');
  } catch (error: any) {
    if (error.code === '23505') {
      console.log('⚠️ User already exists, skipping...');
    } else {
      console.error('❌ Error seeding user:', error);
    }
  }

  // 2. Create Default Majors
  console.log('🌱 Seeding default majors...');
  const defaultMajors = [
    { name: 'Rekayasa Perangkat Lunak', code: 'RPL', description: 'Fokus pada pengembangan perangkat lunak, pemrograman, dan rekayasa sistem.' },
    { name: 'Teknik Komputer dan Jaringan', code: 'TKJ', description: 'Fokus pada infrastruktur jaringan, hardware, dan sistem komputer.' },
    { name: 'Layanan Perbankan', code: 'LP', description: 'Fokus pada layanan keuangan, perbankan, dan akuntansi.' },
    { name: 'Desain Komunikasi Visual', code: 'DKV', description: 'Fokus pada desain grafis, visual branding, dan komunikasi kreatif.' },
    { name: 'Teknik Otomasi Industri', code: 'TOI', description: 'Fokus pada otomasi, robotika, dan sistem kontrol industri.' },
  ];

  let rplMajorId: number | null = null;
  let dkvMajorId: number | null = null;

  try {
    const [admin] = await db.select().from(users).limit(1);

    if (admin) {
      // Delete existing majors to avoid duplicates on re-seed
      await db.delete(majorsTable).where(eq(majorsTable.userId, admin.id));

      for (const major of defaultMajors) {
        const [inserted] = await db.insert(majorsTable).values({
          userId: admin.id,
          name: major.name,
          code: major.code,
          description: major.description,
        }).returning();

        // Store major IDs for class seeding
        if (major.code === 'RPL') rplMajorId = inserted.id;
        if (major.code === 'DKV') dkvMajorId = inserted.id;
      }
      console.log('✅ Majors seeded successfully!');

      // 3. Create Default Classes
      console.log('🌱 Seeding default classes...');

      const defaultClasses = [
        { name: 'X RPL 1', majorId: rplMajorId },
        { name: 'X RPL 2', majorId: rplMajorId },
        { name: 'XI RPL 1', majorId: rplMajorId },
        { name: 'XI RPL 2', majorId: rplMajorId },
        { name: 'X DKV 1', majorId: dkvMajorId },
        { name: 'X DKV 2', majorId: dkvMajorId },
        { name: 'X DKV 3', majorId: dkvMajorId },
      ];


      for (const cls of defaultClasses) {
        if (cls.majorId) {
          await db.insert(classesTable).values({
            userId: admin.id,
            name: cls.name,
            majorId: cls.majorId,
          });
        }
      }
      console.log('✅ Classes seeded successfully!');
    } else {
      console.log('⚠️ No admin user found to associate majors with.');
    }
  } catch (error) {
    console.log('⚠️ Seeding skipped (possibly already exist):', error);
  }

  process.exit(0);
}

seed();
