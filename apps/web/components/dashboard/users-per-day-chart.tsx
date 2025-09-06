'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

interface UserRegistrationData {
  date: string;
  users: number;
  day: string;
}

interface UsersPerDayChartProps {
  data: UserRegistrationData[];
  totalUsers: number;
  usersThisWeek: number;
}

const chartConfig = {
  users: {
    label: 'New Users',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function UsersPerDayChart({
  data,
  totalUsers,
  usersThisWeek,
}: UsersPerDayChartProps) {
  const maxUsers = Math.max(...data.map((d) => d.users));
  const averagePerDay = usersThisWeek / 7;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {averagePerDay.toFixed(1)} per day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.find((d) => d.users === maxUsers)?.day || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Registrations - Past 7 Days</CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily new user registrations over the past week
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [
                      `${value} new user${value !== 1 ? 's' : ''}`,
                      name,
                    ]}
                  />
                }
              />
              <Bar
                dataKey="users"
                fill="var(--color-users)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}