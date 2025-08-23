import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateResumes() {
  console.log('Starting resume migration...');

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
        'No applications with resume data found. Migration complete.',
      );
      return;
    }

    // Step 2: Create a map to track unique resumes by URL and name
    const resumeMap = new Map<
      string,
      { id: string; name: string; url: string; userId: string }
    >();

    // Step 3: Process each application and create unique resumes
    for (const application of applicationsWithResumes) {
      if (!application.resume) {
        console.log(`Skipping application ${application.id} - no resume URL`);
        continue;
      }

      // Create a unique key for the resume (URL + name combination)
      const resumeKey = `${application.resume}|${application.resumeName || 'Unnamed Resume'}`;

      if (!resumeMap.has(resumeKey)) {
        // Create new resume record
        const newResume = await prisma.resume.create({
          data: {
            name: application.resumeName || 'Unnamed Resume',
            url: application.resume,
            userId: application.userId,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
          },
        });

        resumeMap.set(resumeKey, {
          id: newResume.id,
          name: newResume.name,
          url: newResume.url,
          userId: newResume.userId,
        });

        console.log(`Created new resume: ${newResume.name} (${newResume.id})`);
      }

      // Step 4: Update the application to reference the resume
      const resumeData = resumeMap.get(resumeKey)!;

      await prisma.application.update({
        where: { id: application.id },
        data: {
          resumeId: resumeData.id,
        },
      });

      console.log(
        `Updated application ${application.id} to reference resume ${resumeData.id}`,
      );
    }

    // Step 5: Clean up old resume fields (optional - uncomment if you want to remove old data)
    console.log('Cleaning up old resume fields...');

    const cleanupResult = await prisma.application.updateMany({
      where: {
        OR: [{ resume: { not: null } }, { resumeName: { not: null } }],
      },
      data: {
        resume: null,
        resumeName: null,
      },
    });

    console.log(`Cleaned up ${cleanupResult.count} applications`);

    console.log('Resume migration completed successfully!');
    console.log(`Created ${resumeMap.size} unique resumes`);
    console.log(`Updated ${applicationsWithResumes.length} applications`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateResumes()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
