# Resume Migration and Deduplication Scripts

This collection of scripts handles migrating resume data from the old method of storing resumes directly in the `applications` table to the new dedicated `resumes` table, and then deduplicating resumes to prepare for adding unique constraints.

## Available Scripts

### 1. Resume Migration Scripts

**What the migration script does:**

1. **Finds applications with resume data**: Locates all applications that have data in the old `resume` or `resumeName` fields
2. **Creates unique resumes**: For each unique resume (based on URL + name combination), creates a new record in the `resumes` table
3. **Updates applications**: Links each application to the appropriate resume via the `resumeId` field
4. **Cleans up old data**: Removes the old `resume` and `resumeName` fields from applications

### 2. Resume Deduplication Scripts

**What the deduplication script does:**

1. **Finds duplicate resumes**: Identifies resumes with the same `name` and `userId` but different URLs
2. **Keeps the best resume**: For each duplicate group, keeps the oldest resume (or the one with most applications if same date)
3. **Updates applications**: Moves all applications to reference the kept resume
4. **Removes duplicates**: Deletes the duplicate resume records
5. **Verifies results**: Confirms no duplicates remain

### 3. Constraint Verification Script

**What the verification script does:**

1. **Checks for duplicates**: Verifies no duplicate combinations of `name`, `userId`, and `url` exist
2. **Provides guidance**: Shows how to add the unique constraint to the schema

## Prerequisites

- Ensure your database is up to date with the latest schema
- Make sure you have a backup of your database before running the migration
- The script requires the `resumeId` field to already exist in the `Application` model

## Running the Scripts

### Step 1: Resume Migration

1. Navigate to the database package:

   ```bash
   cd packages/database
   ```

2. Run the migration dry-run first:

   ```bash
   npm run migrate:resumes:dry-run
   ```

3. If everything looks good, run the actual migration:

   ```bash
   npm run migrate:resumes
   ```

### Step 2: Resume Deduplication

1. Run the deduplication dry-run:

   ```bash
   npm run deduplicate:resumes:dry-run
   ```

2. If everything looks good, run the actual deduplication:

   ```bash
   npm run deduplicate:resumes
   ```

### Step 3: Add Unique Constraint

1. Verify no duplicates remain:

   ```bash
   npm run verify:resume-constraint
   ```

2. Add the unique constraint to your Prisma schema:

   ```prisma
   model Resume {
     // ... existing fields ...

     @@unique([name, userId, url])
   }
   ```

3. Run the migration:

   ```bash
   npx prisma migrate dev --name add_resume_unique_constraint
   ```

## What to expect

### Migration Script Output:

- Number of applications found with resume data
- Each new resume being created
- Each application being updated
- Summary of the migration results

### Deduplication Script Output:

- Number of duplicate groups found
- Which resumes will be kept vs deleted
- Number of applications that will be updated
- Verification that no duplicates remain

### Constraint Verification Output:

- Confirmation that no duplicates exist
- Instructions for adding the unique constraint

## Safety features

### Migration Script:

- **Deduplication**: The script creates only one resume record per unique resume (URL + name combination)
- **Error handling**: If the migration fails, the script will log the error and exit gracefully
- **Preserves timestamps**: The original `createdAt` and `updatedAt` timestamps are preserved in the new resume records

### Deduplication Script:

- **Smart selection**: Keeps the oldest resume (or most used if same date) when duplicates exist
- **Application preservation**: All applications are updated to reference the kept resume
- **Verification**: Confirms no duplicates remain after the process
- **Dry-run available**: Preview all changes before making them

### Constraint Verification:

- **Pre-flight check**: Verifies no duplicates exist before suggesting constraint addition
- **Clear guidance**: Provides exact steps for adding the unique constraint

## Rollback

If you need to rollback this migration, you would need to:

1. Restore the old `resume` and `resumeName` fields in the schema
2. Write a reverse migration script to move data back
3. Drop the `resumes` table

## Schema changes

This migration supports the transition from:

```prisma
model Application {
  // Old fields (to be removed)
  resume     String?
  resumeName String?

  // New field (to be added)
  resumeId   String?
  connectedResume Resume? @relation(fields: [resumeId], references: [id])
}
```

To:

```prisma
model Resume {
  id        String   @id @default(cuid())
  name      String
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  Application Application[]
}

model Application {
  // Only the new field
  resumeId        String?
  connectedResume Resume? @relation(fields: [resumeId], references: [id])
}
```
