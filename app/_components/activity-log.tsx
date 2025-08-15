"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ActivityType, EntityType, Platform } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Calendar, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  platform?: Platform;
  createdAt: string;
  application?: {
    title: string;
    company: { name: string };
  };
  company?: {
    name: string;
  };
  contact?: {
    name: string;
  };
  interview?: {
    type: string;
    application: { title: string };
  };
  note?: {
    type: string;
  };
  offer?: {
    title: string;
  };
}

interface ActivityStats {
  totalActivities: number;
  typeStats: Record<string, number>;
  entityStats: Record<string, number>;
  period: string;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.APPLICATION_CREATED:
    case ActivityType.APPLICATION_UPDATED:
    case ActivityType.APPLICATION_STATUS_CHANGED:
      return "📄";
    case ActivityType.COMPANY_CREATED:
    case ActivityType.COMPANY_UPDATED:
      return "🏢";
    case ActivityType.CONTACT_CREATED:
    case ActivityType.CONTACT_UPDATED:
      return "👤";
    case ActivityType.INTERVIEW_CREATED:
    case ActivityType.INTERVIEW_UPDATED:
    case ActivityType.INTERVIEW_COMPLETED:
      return "🎤";
    case ActivityType.NOTE_CREATED:
    case ActivityType.NOTE_UPDATED:
      return "📝";
    case ActivityType.OFFER_CREATED:
    case ActivityType.OFFER_ACCEPTED:
    case ActivityType.OFFER_DECLINED:
      return "💼";
    case ActivityType.RESUME_UPLOADED:
      return "📎";
    case ActivityType.DASHBOARD_VIEWED:
      return "📊";
    case ActivityType.LOGIN:
      return "🔐";
    case ActivityType.LOGOUT:
      return "🚪";
    default:
      return "📌";
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case ActivityType.APPLICATION_CREATED:
    case ActivityType.COMPANY_CREATED:
    case ActivityType.CONTACT_CREATED:
    case ActivityType.INTERVIEW_CREATED:
    case ActivityType.NOTE_CREATED:
    case ActivityType.OFFER_CREATED:
      return "bg-green-100 text-green-800 border-green-200";
    case ActivityType.APPLICATION_UPDATED:
    case ActivityType.COMPANY_UPDATED:
    case ActivityType.CONTACT_UPDATED:
    case ActivityType.INTERVIEW_UPDATED:
    case ActivityType.NOTE_UPDATED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case ActivityType.APPLICATION_STATUS_CHANGED:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case ActivityType.INTERVIEW_COMPLETED:
    case ActivityType.OFFER_ACCEPTED:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case ActivityType.OFFER_DECLINED:
      return "bg-red-100 text-red-800 border-red-200";
    case ActivityType.LOGIN:
    case ActivityType.DASHBOARD_VIEWED:
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case ActivityType.LOGOUT:
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

interface ActivityLogProps {
  userId?: string;
  limit?: number;
  showStats?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function ActivityLog({
  userId,
  limit = 50,
  showStats = true,
  showFilters = true,
  className,
}: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | "ALL">("ALL");
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | "ALL">("ALL");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      setActivities(data.activities);
      if (showStats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  const filteredActivities = activities.filter((activity) => {
    if (selectedEntityType !== "ALL" && activity.entityType !== selectedEntityType) {
      return false;
    }
    if (selectedActivityType !== "ALL" && activity.type !== selectedActivityType) {
      return false;
    }
    return true;
  });

  const entityTypes = Object.values(EntityType);
  const activityTypes = Object.values(ActivityType);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading activities...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error: {error}
            <Button
              variant="outline"
              onClick={fetchActivities}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {showStats && stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Summary ({stats.period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalActivities}
                </div>
                <div className="text-sm text-gray-600">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(stats.entityStats).length}
                </div>
                <div className="text-sm text-gray-600">Entity Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.typeStats).length}
                </div>
                <div className="text-sm text-gray-600">Activity Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchActivities}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={selectedEntityType}
                  onChange={(e) => setSelectedEntityType(e.target.value as EntityType | "ALL")}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="ALL">All Entities</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedActivityType}
                  onChange={(e) => setSelectedActivityType(e.target.value as ActivityType | "ALL")}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="ALL">All Activities</option>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-xs", getActivityColor(activity.type))}>
                        {activity.type.replace(/_/g, " ").toLowerCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.entityType.toLowerCase()}
                      </Badge>
                      {activity.platform && (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {activity.platform.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {activity.description}
                    </p>
                    {activity.entityName && (
                      <p className="text-xs text-gray-500 mb-1">
                        {activity.entityName}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span title={format(new Date(activity.createdAt), "PPpp")}>
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                      {activity.ipAddress && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {activity.ipAddress}
                        </span>
                      )}
                    </div>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          View details
                        </summary>
                        <pre className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}