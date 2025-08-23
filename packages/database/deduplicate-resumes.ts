import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deduplicateResumes() {
  console.log('Starting resume deduplication...');

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
      console.log('No duplicate resumes found. Deduplication complete.');
      return;
    }

    let totalResumesToDelete = 0;
    let totalApplicationsToUpdate = 0;

    // Step 4: Process each duplicate group
    for (const [key, resumes] of duplicateGroups) {
      const [name, userId] = key.split('|');
      console.log(`\nProcessing duplicates for "${name}" (User: ${userId}):`);
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

      console.log(`  Keeping resume: ${resumeToKeep.id} (${resumeToKeep.url})`);
      console.log(`    Created: ${resumeToKeep.createdAt.toISOString()}`);
      console.log(`    Applications: ${resumeToKeep._count.Application}`);

      // Step 5: Update applications to reference the resume we're keeping
      for (const resumeToDelete of resumesToDelete) {
        console.log(
          `  Deleting resume: ${resumeToDelete.id} (${resumeToDelete.url})`,
        );
        console.log(`    Created: ${resumeToDelete.createdAt.toISOString()}`);
        console.log(`    Applications: ${resumeToDelete._count.Application}`);

        // Update all applications that reference this resume
        const updateResult = await prisma.application.updateMany({
          where: {
            resumeId: resumeToDelete.id,
          },
          data: {
            resumeId: resumeToKeep.id,
          },
        });

        console.log(
          `    Updated ${updateResult.count} applications to reference ${resumeToKeep.id}`,
        );

        // Delete the duplicate resume
        await prisma.resume.delete({
          where: {
            id: resumeToDelete.id,
          },
        });

        totalResumesToDelete++;
        totalApplicationsToUpdate += updateResult.count;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('DEDUPLICATION SUMMARY:');
    console.log(`- Processed ${duplicateGroups.length} duplicate groups`);
    console.log(`- Deleted ${totalResumesToDelete} duplicate resumes`);
    console.log(`- Updated ${totalApplicationsToUpdate} applications`);

    // Step 6: Verify the deduplication worked
    const remainingResumes = await prisma.resume.findMany({
      select: {
        name: true,
        userId: true,
      },
    });

    const remainingGroups = new Map<string, number>();
    for (const resume of remainingResumes) {
      const key = `${resume.name}|${resume.userId}`;
      remainingGroups.set(key, (remainingGroups.get(key) || 0) + 1);
    }

    const stillDuplicates = Array.from(remainingGroups.entries()).filter(
      ([_, count]) => count > 1,
    );

    if (stillDuplicates.length > 0) {
      console.log(
        `⚠️  WARNING: Still found ${stillDuplicates.length} groups with duplicates:`,
      );
      stillDuplicates.forEach(([key, count]) => {
        const [name, userId] = key.split('|');
        console.log(`  - "${name}" (User: ${userId}): ${count} resumes`);
      });
    } else {
      console.log('✅ All duplicates have been successfully removed!');
    }

    console.log('\nResume deduplication completed successfully!');
  } catch (error) {
    console.error('Deduplication failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deduplication
deduplicateResumes()
  .then(() => {
    console.log('Deduplication script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deduplication script failed:', error);
    process.exit(1);
  });
