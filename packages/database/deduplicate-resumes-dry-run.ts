import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deduplicateResumesDryRun() {
  console.log('Starting resume deduplication DRY RUN...');
  console.log('This will show what would happen without making any changes.\n');

  try {
    // Step 1: Find all resumes and group them by name + userId
    const allResumes = await prisma.resume.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Application: true,
          },
        },
      },
    });

    console.log(`Found ${allResumes.length} total resumes`);

    // Step 2: Group resumes by name + userId
    const resumeGroups = new Map<string, typeof allResumes>();

    for (const resume of allResumes) {
      const key = `${resume.name}|${resume.userId}`;
      if (!resumeGroups.has(key)) {
        resumeGroups.set(key, []);
      }
      resumeGroups.get(key)!.push(resume);
    }

    // Step 3: Find groups with duplicates
    const duplicateGroups = Array.from(resumeGroups.entries()).filter(
      ([_, resumes]) => resumes.length > 1,
    );

    console.log(
      `Found ${duplicateGroups.length} groups with duplicate resumes`,
    );

    if (duplicateGroups.length === 0) {
      console.log(
        'No duplicate resumes found. Deduplication would be complete.',
      );
      return;
    }

    let totalResumesToDelete = 0;
    let totalApplicationsToUpdate = 0;

    console.log('\nDUPLICATE GROUPS TO PROCESS:');
    console.log('='.repeat(80));

    // Step 4: Process each duplicate group
    for (const [key, resumes] of duplicateGroups) {
      const [name, userId] = key.split('|');
      console.log(`\nGroup: "${name}" (User: ${userId})`);
      console.log(`  Found ${resumes.length} resumes with same name`);

      // Sort resumes by creation date (keep the oldest) and then by number of applications
      const sortedResumes = resumes.sort((a, b) => {
        // First, sort by creation date (oldest first)
        const dateComparison = a.createdAt.getTime() - b.createdAt.getTime();
        if (dateComparison !== 0) return dateComparison;

        // If same date, sort by number of applications (most applications first)
        return b._count.Application - a._count.Application;
      });

      // The first resume (oldest, or most used if same date) will be kept
      const resumeToKeep = sortedResumes[0];
      const resumesToDelete = sortedResumes.slice(1);

      console.log(`  ✅ Would KEEP: ${resumeToKeep.id}`);
      console.log(`     URL: ${resumeToKeep.url}`);
      console.log(`     Created: ${resumeToKeep.createdAt.toISOString()}`);
      console.log(`     Applications: ${resumeToKeep._count.Application}`);

      // Step 5: Show what would be deleted
      for (const resumeToDelete of resumesToDelete) {
        console.log(`  ❌ Would DELETE: ${resumeToDelete.id}`);
        console.log(`     URL: ${resumeToDelete.url}`);
        console.log(`     Created: ${resumeToDelete.createdAt.toISOString()}`);
        console.log(`     Applications: ${resumeToDelete._count.Application}`);
        console.log(
          `     → Would update ${resumeToDelete._count.Application} applications to reference ${resumeToKeep.id}`,
        );

        totalResumesToDelete++;
        totalApplicationsToUpdate += resumeToDelete._count.Application;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('DRY RUN SUMMARY:');
    console.log(`- Would process ${duplicateGroups.length} duplicate groups`);
    console.log(`- Would delete ${totalResumesToDelete} duplicate resumes`);
    console.log(`- Would update ${totalApplicationsToUpdate} applications`);

    // Step 6: Show some statistics
    console.log('\nSTATISTICS:');
    console.log('='.repeat(80));

    const totalResumes = allResumes.length;
    const uniqueResumesAfterDedup = totalResumes - totalResumesToDelete;

    console.log(`- Current total resumes: ${totalResumes}`);
    console.log(`- Resumes after deduplication: ${uniqueResumesAfterDedup}`);
    console.log(
      `- Reduction: ${totalResumesToDelete} resumes (${((totalResumesToDelete / totalResumes) * 100).toFixed(1)}%)`,
    );

    // Show the largest duplicate groups
    const largestGroups = duplicateGroups
      .sort(([_, a], [__, b]) => b.length - a.length)
      .slice(0, 5);

    if (largestGroups.length > 0) {
      console.log('\nLARGEST DUPLICATE GROUPS:');
      largestGroups.forEach(([key, resumes], index) => {
        const [name, userId] = key.split('|');
        console.log(
          `  ${index + 1}. "${name}" (User: ${userId}): ${resumes.length} resumes`,
        );
      });
    }

    // Check for potential issues
    console.log('\nPOTENTIAL ISSUES TO CHECK:');
    console.log('='.repeat(80));

    // Check if any resumes to be deleted have more applications than the one to keep
    let problematicDeletions = 0;
    for (const [key, resumes] of duplicateGroups) {
      const sortedResumes = resumes.sort((a, b) => {
        const dateComparison = a.createdAt.getTime() - b.createdAt.getTime();
        if (dateComparison !== 0) return dateComparison;
        return b._count.Application - a._count.Application;
      });

      const resumeToKeep = sortedResumes[0];
      const resumesToDelete = sortedResumes.slice(1);

      for (const resumeToDelete of resumesToDelete) {
        if (
          resumeToDelete._count.Application > resumeToKeep._count.Application
        ) {
          problematicDeletions++;
          const [name, userId] = key.split('|');
          console.log(
            `⚠️  WARNING: Resume ${resumeToDelete.id} has ${resumeToDelete._count.Application} applications`,
          );
          console.log(
            `    but would be deleted in favor of ${resumeToKeep.id} with ${resumeToKeep._count.Application} applications`,
          );
          console.log(`    (Group: "${name}" for user ${userId})`);
        }
      }
    }

    if (problematicDeletions === 0) {
      console.log('✅ No problematic deletions found');
    }

    console.log('\n' + '='.repeat(80));
    console.log('DRY RUN COMPLETE - No changes were made to the database');
    console.log(
      'To run the actual deduplication, use: npm run deduplicate:resumes',
    );
  } catch (error) {
    console.error('Dry run failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the dry run
deduplicateResumesDryRun()
  .then(() => {
    console.log('\nDry run script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Dry run script failed:', error);
    process.exit(1);
  });
