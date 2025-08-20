"use server";

import { CompanyFormData } from "@/app/(dashboard)/dashboard/companies/lib/new-company-schema";
import { getSignedInUser } from "@/app/lib/auth";
import { prisma } from "../prisma";
import { ActivityTracker } from "../services/activity-tracker";
import { CompanyVisibility } from "@prisma/client";

export async function createCompany({
  company,
  useExistingCompanyId,
}: {
  company?: CompanyFormData;
  useExistingCompanyId?: string;
}) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const {
    name,
    website,
    description,
    industry,
    size,
    location,
    logo,
    visibility = "PRIVATE",
    isGlobal = false,
  } = company ?? {};

  if (!name) {
    return { error: "Company name is required" };
  }

  // If user wants to use an existing company, return that company
  if (useExistingCompanyId) {
    const existingCompany = await prisma.company.findUnique({
      where: { id: useExistingCompanyId },
    });

    if (!existingCompany) {
      return { error: "Company not found" };
    }

    return { success: true, company: existingCompany };
  }

  // Determine visibility and global status based on user role and preferences
  let finalVisibility = visibility as CompanyVisibility;
  let finalIsGlobal = isGlobal;

  // Admin users can create global companies
  if (dbUser.role === "ADMIN" && isGlobal) {
    finalVisibility = "GLOBAL";
    finalIsGlobal = true;
  } else if (dbUser.role === "ADMIN" && visibility === "PUBLIC") {
    finalVisibility = "PUBLIC";
    finalIsGlobal = false;
  } else {
    // Regular users can only create private companies
    finalVisibility = "PRIVATE";
    finalIsGlobal = false;
  }

  // Check for duplicates only if creating a PUBLIC or GLOBAL company
  if (finalVisibility === "PUBLIC" || finalVisibility === "GLOBAL") {
    const exactDuplicate = await prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        OR: [{ visibility: "GLOBAL" }, { visibility: "PUBLIC" }],
      },
    });

    if (exactDuplicate) {
      return {
        error:
          "A company with this name already exists in the public database. Please use the existing company or create a private company instead.",
        existingCompany: exactDuplicate,
        isPublicDuplicate: true,
      };
    }
  }

  const newCompany = await prisma.company.create({
    data: {
      name,
      website,
      description,
      industry,
      size,
      location,
      logo,
      visibility: finalVisibility,
      isGlobal: finalIsGlobal,
      createdBy: dbUser.id,
    },
  });

  await ActivityTracker.trackCompanyCreated(newCompany.id, newCompany.name);

  return { success: true, company: newCompany };
}

export async function updateCompany(id: string, company: CompanyFormData) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  try {
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { ...company },
    });

    await ActivityTracker.trackCompanyUpdated(
      updatedCompany.id,
      updatedCompany.name,
      { changes: { oldData: company, newData: updatedCompany } },
    );

    return { success: true, company: updatedCompany };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.company.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}
