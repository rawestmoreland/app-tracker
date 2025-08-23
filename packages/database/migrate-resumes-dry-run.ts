import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateResumesDryRun() {
  console.log('Starting resume migration DRY RUN...');
  console.log('This will show what would happen without making any changes.\n');

  try {
    // Step 1: Find all applications with resume data in old fields
    const applicationsWithResumes = await prisma.application.findMany({
      where: {
        OR: [{ resume: { not: null } }, { resumeName: { not: null } }],
      },
      select: {
        id: true,
        userId: true,
        resume: true,
        resumeName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `Found ${applicationsWithResumes.length} applications with resume data`,
    );

    if (applicationsWithResumes.length === 0) {
      console.log(
        'No applications with resume data found. Migration would be complete.',
      );
      return;
    }

    // Step 2: Analyze unique resumes
    const resumeMap = new Map<
      string,
      { name: string; url: string; userId: string; applications: string[] }
    >();

    for (const application of applicationsWithResumes) {
      if (!application.resume) {
        console.log(`Would skip application ${application.id} - no resume URL`);
        continue;
      }

      const resumeKey = `${application.resume}|${application.resumeName || 'Unnamed Resume'}`;

      if (!resumeMap.has(resumeKey)) {
        resumeMap.set(resumeKey, {
          name: application.resumeName || 'Unnamed Resume',
          url: application.resume,
          userId: application.userId,
          applications: [application.id],
        });
      } else {
        const existing = resumeMap.get(resumeKey)!;
        existing.applications.push(application.id);
      }
    }

    console.log(`\nWould create ${resumeMap.size} unique resumes:`);
    console.log('='.repeat(80));

    let resumeCount = 1;
    for (const [key, resumeData] of resumeMap.entries()) {
      console.log(`\n${resumeCount}. Resume: "${resumeData.name}"`);
      console.log(`   URL: ${resumeData.url}`);
      console.log(`   User ID: ${resumeData.userId}`);
      console.log(
        `   Would be used by ${resumeData.applications.length} application(s):`,
      );
      resumeData.applications.forEach((appId) => {
        console.log(`     - ${appId}`);
      });
      resumeCount++;
    }

    console.log('\n' + '='.repeat(80));
    console.log(`SUMMARY:`);
    console.log(
      `- Total applications to process: ${applicationsWithResumes.length}`,
    );
    console.log(`- Unique resumes to create: ${resumeMap.size}`);
    console.log(
      `- Applications that would be updated: ${applicationsWithResumes.length}`,
    );
    console.log(
      `- Applications that would be cleaned up: ${applicationsWithResumes.length}`,
    );

    // Check for potential issues
    console.log('\nPOTENTIAL ISSUES TO CHECK:');
    console.log('='.repeat(80));

    // Check for applications that already have resumeId
    const applicationsWithExistingResumeId = await prisma.application.findMany({
      where: {
        AND: [
          {
            OR: [{ resume: { not: null } }, { resumeName: { not: null } }],
          },
          { resumeId: { not: null } },
        ],
      },
      select: {
        id: true,
        resumeId: true,
        resume: true,
        resumeName: true,
      },
    });

    if (applicationsWithExistingResumeId.length > 0) {
      console.log(
        `⚠️  WARNING: ${applicationsWithExistingResumeId.length} applications already have resumeId set:`,
      );
      applicationsWithExistingResumeId.forEach((app) => {
        console.log(`   - Application ${app.id} has resumeId: ${app.resumeId}`);
        console.log(`     Old resume: ${app.resume}`);
        console.log(`     Old resumeName: ${app.resumeName}`);
      });
    } else {
      console.log('✅ No applications with existing resumeId found');
    }

    // Check for duplicate resume names per user
    const userResumeCounts = new Map<string, number>();
    for (const resumeData of resumeMap.values()) {
      const userKey = `${resumeData.userId}|${resumeData.name}`;
      userResumeCounts.set(userKey, (userResumeCounts.get(userKey) || 0) + 1);
    }

    const duplicates = Array.from(userResumeCounts.entries()).filter(
      ([_, count]) => count > 1,
    );
    if (duplicates.length > 0) {
      console.log(
        `⚠️  WARNING: Found ${duplicates.length} potential duplicate resume names per user:`,
      );
      duplicates.forEach(([userKey, count]) => {
        const [userId, name] = userKey.split('|');
        console.log(`   - User ${userId} has ${count} resumes named "${name}"`);
      });
    } else {
      console.log('✅ No duplicate resume names per user found');
    }

    console.log('\n' + '='.repeat(80));
    console.log('DRY RUN COMPLETE - No changes were made to the database');
    console.log('To run the actual migration, use: npm run migrate:resumes');
  } catch (error) {
    console.error('Dry run failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the dry run
migrateResumesDryRun()
  .then(() => {
    console.log('\nDry run script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Dry run script failed:', error);
    process.exit(1);
  });
