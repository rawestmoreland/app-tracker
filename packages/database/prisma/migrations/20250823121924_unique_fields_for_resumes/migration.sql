/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `resumes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId,url]` on the table `resumes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "resumes_url_key" ON "public"."resumes"("url");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_name_userId_url_key" ON "public"."resumes"("name", "userId", "url");
