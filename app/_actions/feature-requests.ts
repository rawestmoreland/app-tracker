"use server";

import { getSignedInUser } from "../lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formSchema } from "@/components/feedback-dialog";

export async function createFeatureRequest(data: z.infer<typeof formSchema>) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return {
      error: "User not found or not authenticated",
    };
  }

  try {
    const featureRequest = await prisma.featureRequest.create({
      data: {
        ...data,
        userId: dbUser.id,
      },
    });

    return {
      success: true,
      featureRequest,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to create feature request",
    };
  }
}
