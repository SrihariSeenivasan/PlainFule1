import prisma from './database';

export const initializeDatabase = async () => {
  try {
    // Test connection
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Prisma will automatically handle migrations
    // Run: npm run prisma:migrate to create tables from schema.prisma
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

