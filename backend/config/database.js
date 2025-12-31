const { PrismaClient } = require('@prisma/client');

/**
 * Prisma Client Instance
 * Singleton pattern for database connection
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Connect to Database
 * Initializes Prisma Client connection
 */
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to MongoDB Atlas');
  } catch (error) {
    console.error(`❌ Prisma Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from Database
 * Gracefully closes Prisma connection
 */
const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('✅ Prisma disconnected');
};

module.exports = { prisma, connectDB, disconnectDB };

