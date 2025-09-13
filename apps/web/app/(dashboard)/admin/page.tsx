import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import { UsersPerDayChart } from '@/components/dashboard/users-per-day-chart';
import Link from 'next/link';

interface UserRegistrationData {
  date: string;
  users: number;
  day: string;
}

async function fetchUserRegistrationData(): Promise<{
  chartData: UserRegistrationData[];
  totalUsers: number;
  usersThisWeek: number;
}> {
  // Fetch total user count
  const totalUsers = await prisma.user.count();

  // Get users from the past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Create array for the past 7 days
  const chartData: UserRegistrationData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const usersOnDay = users.filter(
      (user) => user.createdAt >= date && user.createdAt < nextDate,
    ).length;

    chartData.push({
      date: date.toISOString().split('T')[0],
      users: usersOnDay,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }

  const usersThisWeek = users.length;

  return {
    chartData,
    totalUsers,
    usersThisWeek,
  };
}

export async function generateMetadata() {
  return {
    title: 'Admin Dashboard - Job Tracker',
    description: 'Monitor user registrations and system metrics',
  };
}

export default async function AdminPage() {
  const { dbUser } = await getSignedInUser();
  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    return unauthorized();
  }

  const { chartData, totalUsers, usersThisWeek } =
    await fetchUserRegistrationData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor user registrations and system metrics
        </p>
        <div className="mt-4">
          <Link className="text-blue-600 underline" href="/admin/companies">
            Companies
          </Link>
        </div>
      </div>

      {/* Users Chart */}
      <UsersPerDayChart
        data={chartData}
        totalUsers={totalUsers}
        usersThisWeek={usersThisWeek}
      />
    </div>
  );
}
