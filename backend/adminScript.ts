import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// Admin credentials
const ADMIN_EMAIL = 'admin@plainfuel.com';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_FIRST_NAME = 'Admin';
const ADMIN_LAST_NAME = 'User';

async function createAdminUser() {
  try {
    console.log('🔒 Starting admin user creation...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log(`📧 Email: ${ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        role: 'ADMIN',
        phone: '+1 (555) 000-0000',
        address: 'Admin Address',
        city: 'Admin City',
        state: 'AC',
        zip: '00000',
        country: 'Admin Country',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`👤 Name: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    console.log(`🔐 Role: ADMIN`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Use these credentials to login to the admin panel');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
