import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addResumeUniqueConstraint() {
  console.log('Adding unique constraint to resumes table...');
  console.log(
    'This will add a unique constraint on (name, userId, url) combination.',
  );

  try {
    // First, let's verify there are no duplicates before adding the constraint
    const allResumes = await prisma.resume.findMany({
      select: {
        name: true,
        userId: true,
        url: true,
      },
    });

    console.log(`Found ${allResumes.length} total resumes`);

    // Check for duplicates
    const resumeMap = new Map<string, number>();
    for (const resume of allResumes) {
      const key = `${resume.name}|${resume.userId}|${resume.url}`;
      resumeMap.set(key, (resumeMap.get(key) || 0) + 1);
    }

    const duplicates = Array.from(resumeMap.entries()).filter(
      ([_, count]) => count > 1,
    );

    if (duplicates.length > 0) {
      console.log(
        `❌ ERROR: Found ${duplicates.length} duplicate combinations:`,
      );
      duplicates.forEach(([key, count]) => {
        const [name, userId, url] = key.split('|');
        console.log(
          `  - "${name}" (User: ${userId}, URL: ${url}): ${count} instances`,
        );
      });
      console.log(
        '\nPlease run the deduplication script first before adding the unique constraint.',
      );
      return;
    }

    console.log('✅ No duplicates found. Safe to add unique constraint.');

    // Note: In a real scenario, you would add the constraint via a Prisma migration
    // This is just a verification script
    console.log('\nTo add the unique constraint, you need to:');
    console.log('1. Add the following to your Prisma schema:');
    console.log('   @@unique([name, userId, url])');
    console.log(
      '2. Run: npx prisma migrate dev --name add_resume_unique_constraint',
    );
    console.log(
      '3. Or run: npx prisma db push (if you prefer push over migrations)',
    );

    console.log('\nExample schema addition:');
    console.log(`
model Resume {
  id        String   @id @default(cuid())
  name      String
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  Application Application[]

  @@unique([name, userId, url])
  @@index([userId, createdAt])
  @@map("resumes")
}
    `);
  } catch (error) {
    console.error('Constraint verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
addResumeUniqueConstraint()
  .then(() => {
    console.log('Constraint verification completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Constraint verification failed:', error);
    process.exit(1);
  });
