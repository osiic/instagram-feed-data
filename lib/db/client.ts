import { memoryStore } from "./memory-store";

// Mock mode: use in-memory store instead of PostgreSQL
// ponytail: swap back to PrismaClient when DB is available
export const prisma = memoryStore;
