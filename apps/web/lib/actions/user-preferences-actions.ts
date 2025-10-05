'use server';

import { getSignedInUser } from '@/app/lib/auth';
import { UserPreference } from '@prisma/client';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { prefsSchema } from '@/app/(dashboard)/dashboard/profile/_components/ProfileContent';
import { UserPreferences } from '../types/user';

export async function updateApplicationTableColumns(
  newConfig: UserPreference['configValue'],
) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  // Check to see if we have a config for this type / user
  const existingConfig = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'app-table-columns-visibility',
      },
    },
  });

  if (existingConfig) {
    const result = await prisma.userPreference.update({
      where: {
        id: existingConfig.id,
      },
      data: {
        configValue: newConfig,
      },
    });
    revalidatePath('/dashboard');
    return { success: true, result };
  }

  // If we don't have a config for this type / user, create a new one
  try {
    const result = await prisma.userPreference.create({
      data: {
        userId: dbUser.id,
        configName: 'app-table-columns-visibility',
        configValue: newConfig,
      },
    });

    revalidatePath('/dashboard');

    return { success: true, result };
  } catch (error) {
    console.error('Error updating application table columns:', error);
    return {
      success: false,
      error: 'Failed to update application table columns',
    };
  }
}

export async function updateApplicationTablePagination(
  newConfig: UserPreference['configValue'],
) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  try {
    // Extract only the pageSize from the pagination state
    const pageSize =
      typeof newConfig === 'object' &&
      newConfig !== null &&
      'pageSize' in newConfig
        ? (newConfig as { pageSize: number }).pageSize
        : newConfig;

    // Check to see if we have a config for this type / user
    const existingConfig = await prisma.userPreference.findUnique({
      where: {
        userId_configName: {
          userId: dbUser.id,
          configName: 'app-table-pagination-size',
        },
      },
    });

    if (existingConfig) {
      const result = await prisma.userPreference.update({
        where: {
          userId_configName: {
            userId: dbUser.id,
            configName: 'app-table-pagination-size',
          },
        },
        data: {
          configValue: { pageSize },
        },
      });
      revalidatePath('/dashboard');
      return { success: true, result };
    }

    // If we don't have a config for this type / user, create a new one
    const result = await prisma.userPreference.create({
      data: {
        userId: dbUser.id,
        configName: 'app-table-pagination-size',
        configValue: { pageSize },
      },
    });

    revalidatePath('/dashboard');

    return { success: true, result };
  } catch (error) {
    console.error('Error updating application table pagination:', error);
    return {
      success: false,
      error: 'Failed to update application table pagination',
    };
  }
}

export async function updateUserPreferences(data: z.infer<typeof prefsSchema>) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  try {
    const prefs = await prisma.userPreference.upsert({
      where: {
        userId_configName: {
          userId: dbUser.id,
          configName: 'user-preferences',
        },
      },
      update: {
        configValue: {
          receiveEmailNotifications: data.receiveEmailNotifications,
          ghostThreshold: data.ghostThreshold,
          currency: data.currency,
        },
      },
      create: {
        userId: dbUser.id,
        configName: 'user-preferences',
        configValue: {
          receiveEmailNotifications: data.receiveEmailNotifications,
          ghostThreshold: data.ghostThreshold,
          currency: data.currency,
        },
      },
      select: {
        configValue: true,
      },
    });

    // Data opt out is stored on the user model
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        dataOptOut: data.dataOptOut,
      },
    });

    revalidatePath('/dashboard/profile');

    return { success: true, prefs: prefs.configValue as UserPreferences };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      error: 'Failed to update user preferences',
    };
  }
}
