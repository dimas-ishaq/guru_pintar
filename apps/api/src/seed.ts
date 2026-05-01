import { db } from './db';
import { users, majors as majorsTable } from '@guru-pintar/types/schema';
import bcrypt from 'bcrypt';

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
    { name: 'Teknik Komputer dan Jaringan', code: 'TKJ', description: 'Fokus pada infrastruktur jaringan dan hardware.' },
    { name: 'Rekayasa Perangkat Lunak', code: 'RPL', description: 'Fokus pada pengembangan aplikasi dan pemrograman.' },
    { name: 'Multimedia', code: 'MM', description: 'Fokus pada desain grafis dan produksi video.' },
    { name: 'Broadcasting', code: 'BC', description: 'Fokus pada produksi konten media dan penyiaran.' },
  ];

  try {
    const [admin] = await db.select().from(users).limit(1);
    
    if (admin) {
      for (const major of defaultMajors) {
        await db.insert(majorsTable).values({
          userId: admin.id,
          name: major.name,
          code: major.code,
          description: major.description,
        });
      }
      console.log('✅ Majors seeded successfully!');
    } else {
      console.log('⚠️ No admin user found to associate majors with.');
    }
  } catch (error) {
    console.log('⚠️ Majors seeding skipped (possibly already exist)');
  }

  process.exit(0);
}

seed();
