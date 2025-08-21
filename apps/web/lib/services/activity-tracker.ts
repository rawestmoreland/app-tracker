import {
  ActivityType,
  EntityType,
  Platform,
  ApplicationStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import {
  isProgressiveTransition,
  getStageOrder,
  generateSankeyData,
  SankeyData,
} from "@/lib/application-flow";

interface ActivityData {
  type: ActivityType;
  action: string;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  description: string;
  metadata?: Record<string, unknown>;
  platform?: Platform;

  // Status transition fields (for fast querying)
  fromStatus?: ApplicationStatus | null;
  toStatus?: ApplicationStatus;
  isProgression?: boolean;
  stageOrder?: number;

  // Entity relations
  applicationId?: string;
  companyId?: string;
  contactId?: string;
  interviewId?: string;
  noteId?: string;
  offerId?: string;
}

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  platform?: Platform;
}

export class ActivityTracker {
  static async getRequestContext(): Promise<RequestContext> {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
    const userAgent = headersList.get("user-agent") || undefined;

    // Determine platform from user agent
    let platform: Platform = Platform.WEB;
    if (userAgent) {
      if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
        platform = Platform.MOBILE_ANDROID;
      } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        platform = Platform.MOBILE_IOS;
      }
    }

    return { ipAddress, userAgent, platform };
  }

  static async trackActivity(
    data: ActivityData,
    userId?: string,
  ): Promise<void> {
    try {
      // Get current user if not provided
      let activityUserId = userId;
      if (!activityUserId) {
        const user = await currentUser();
        if (!user) return; // Don't track activity for unauthenticated users

        // Get the user record to get the internal ID
        const userRecord = await prisma.user.findUnique({
          where: { clerkId: user.id },
          select: { id: true },
        });

        if (!userRecord) return;
        activityUserId = userRecord.id;
      }

      const context = await this.getRequestContext();

      await prisma.activity.create({
        data: {
          type: data.type,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          entityName: data.entityName,
          description: data.description,
          metadata: data.metadata
            ? JSON.parse(JSON.stringify(data.metadata))
            : null,

          // Status transition fields
          fromStatus: data.fromStatus,
          toStatus: data.toStatus,
          isProgression: data.isProgression,
          stageOrder: data.stageOrder,

          // Context
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          platform: data.platform || context.platform,

          // Relations
          userId: activityUserId,
          applicationId: data.applicationId,
          companyId: data.companyId,
          contactId: data.contactId,
          interviewId: data.interviewId,
          noteId: data.noteId,
          offerId: data.offerId,
        },
      });
    } catch (error) {
      // Log error but don't throw - activity tracking should not break the main flow
      console.error("Failed to track activity:", error);
    }
  }

  // Convenience methods for common activities
  static async trackApplicationCreated(
    applicationId: string,
    applicationTitle: string,
    companyName: string,
  ) {
    await this.trackActivity({
      type: ActivityType.APPLICATION_CREATED,
      action: "created",
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      entityName: applicationTitle,
      description: `Created application for ${applicationTitle} at ${companyName}`,
      applicationId,
    });
  }

  static async trackApplicationUpdated(
    applicationId: string,
    applicationTitle: string,
    changes: Record<string, unknown>,
  ) {
    await this.trackActivity({
      type: ActivityType.APPLICATION_UPDATED,
      action: "updated",
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      entityName: applicationTitle,
      description: `Updated application for ${applicationTitle}`,
      metadata: { changes },
      applicationId,
    });
  }

  static async trackApplicationStatusChanged(
    applicationId: string,
    applicationTitle: string,
    fromStatus: ApplicationStatus | null,
    toStatus: ApplicationStatus,
    reason?: string,
  ) {
    const isProgression = isProgressiveTransition(fromStatus, toStatus);
    const stageOrder = getStageOrder(toStatus);

    await this.trackActivity({
      type: ActivityType.APPLICATION_STATUS_CHANGED,
      action: "status_changed",
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      entityName: applicationTitle,
      description: fromStatus
        ? `Changed status from ${fromStatus.replace(/_/g, " ").toLowerCase()} to ${toStatus.replace(/_/g, " ").toLowerCase()} for ${applicationTitle}`
        : `Set initial status to ${toStatus.replace(/_/g, " ").toLowerCase()} for ${applicationTitle}`,

      // Populate dedicated columns for fast querying
      fromStatus,
      toStatus,
      isProgression,
      stageOrder,

      // Keep minimal metadata for additional context
      metadata: {
        reason,
        transitionType: fromStatus ? "update" : "initial",
      },
      applicationId,
    });
  }

  static async trackApplicationArchived(
    applicationId: string,
    applicationTitle: string,
    companyName: string,
  ) {
    await this.trackActivity({
      type: ActivityType.APPLICATION_ARCHIVED,
      action: "archived",
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      entityName: applicationTitle,
      description: `Archived application for ${applicationTitle} at ${companyName}`,
      applicationId,
    });
  }

  // Specialized method for initial application status (when creating an application)
  static async trackApplicationInitialStatus(
    applicationId: string,
    applicationTitle: string,
    status: ApplicationStatus,
    _appliedAt?: Date,
  ) {
    await this.trackApplicationStatusChanged(
      applicationId,
      applicationTitle,
      null,
      status,
      "Initial application submission",
    );
  }

  static async trackCompanyCreated(companyId: string, companyName: string) {
    await this.trackActivity({
      type: ActivityType.COMPANY_CREATED,
      action: "created",
      entityType: EntityType.COMPANY,
      entityId: companyId,
      entityName: companyName,
      description: `Created company ${companyName}`,
      companyId,
    });
  }

  static async trackCompanyUpdated(
    companyId: string,
    companyName: string,
    changes: Record<string, unknown>,
  ) {
    await this.trackActivity({
      type: ActivityType.COMPANY_UPDATED,
      action: "updated",
      entityType: EntityType.COMPANY,
      entityId: companyId,
      entityName: companyName,
      description: `Updated company ${companyName}`,
      metadata: { changes },
      companyId,
    });
  }

  static async trackContactCreated(
    contactId: string,
    contactName: string,
    companyName?: string,
  ) {
    await this.trackActivity({
      type: ActivityType.CONTACT_CREATED,
      action: "created",
      entityType: EntityType.CONTACT,
      entityId: contactId,
      entityName: contactName,
      description: `Created contact ${contactName}${companyName ? ` at ${companyName}` : ""}`,
      contactId,
    });
  }

  static async trackContactUpdated(
    contactId: string,
    contactName: string,
    changes: Record<string, unknown>,
  ) {
    await this.trackActivity({
      type: ActivityType.CONTACT_UPDATED,
      action: "updated",
      entityType: EntityType.CONTACT,
      entityId: contactId,
      entityName: contactName,
      description: `Updated contact ${contactName}`,
      metadata: { changes },
      contactId,
    });
  }

  static async trackInterviewCreated(
    interviewId: string,
    interviewType: string,
    applicationTitle: string,
  ) {
    await this.trackActivity({
      type: ActivityType.INTERVIEW_CREATED,
      action: "created",
      entityType: EntityType.INTERVIEW,
      entityId: interviewId,
      entityName: `${interviewType} Interview`,
      description: `Scheduled ${interviewType} interview for ${applicationTitle}`,
      interviewId,
    });
  }

  static async trackInterviewUpdated(
    interviewId: string,
    interviewType: string,
    changes: Record<string, unknown>,
  ) {
    await this.trackActivity({
      type: ActivityType.INTERVIEW_UPDATED,
      action: "updated",
      entityType: EntityType.INTERVIEW,
      entityId: interviewId,
      entityName: `${interviewType} Interview`,
      description: `Updated ${interviewType} interview`,
      metadata: { changes },
      interviewId,
    });
  }

  static async trackInterviewCompleted(
    interviewId: string,
    interviewType: string,
    outcome: string,
  ) {
    await this.trackActivity({
      type: ActivityType.INTERVIEW_COMPLETED,
      action: "completed",
      entityType: EntityType.INTERVIEW,
      entityId: interviewId,
      entityName: `${interviewType} Interview`,
      description: `Completed ${interviewType} interview with outcome: ${outcome}`,
      metadata: { outcome },
      interviewId,
    });
  }

  static async trackNoteCreated(
    noteId: string,
    noteType: string,
    relatedEntity?: string,
  ) {
    await this.trackActivity({
      type: ActivityType.NOTE_CREATED,
      action: "created",
      entityType: EntityType.NOTE,
      entityId: noteId,
      entityName: `${noteType} Note`,
      description: `Created ${noteType} note${relatedEntity ? ` for ${relatedEntity}` : ""}`,
      noteId,
    });
  }

  static async trackOfferReceived(
    offerId: string,
    offerTitle: string,
    companyName: string,
  ) {
    await this.trackActivity({
      type: ActivityType.OFFER_CREATED,
      action: "received",
      entityType: EntityType.OFFER,
      entityId: offerId,
      entityName: offerTitle,
      description: `Received offer for ${offerTitle} from ${companyName}`,
      offerId,
    });
  }

  static async trackOfferAccepted(offerId: string, offerTitle: string) {
    await this.trackActivity({
      type: ActivityType.OFFER_ACCEPTED,
      action: "accepted",
      entityType: EntityType.OFFER,
      entityId: offerId,
      entityName: offerTitle,
      description: `Accepted offer for ${offerTitle}`,
      offerId,
    });
  }

  static async trackOfferDeclined(offerId: string, offerTitle: string) {
    await this.trackActivity({
      type: ActivityType.OFFER_DECLINED,
      action: "declined",
      entityType: EntityType.OFFER,
      entityId: offerId,
      entityName: offerTitle,
      description: `Declined offer for ${offerTitle}`,
      offerId,
    });
  }

  static async trackResumeUploaded(
    applicationId: string,
    applicationTitle: string,
    fileName: string,
  ) {
    await this.trackActivity({
      type: ActivityType.RESUME_UPLOADED,
      action: "uploaded",
      entityType: EntityType.DOCUMENT,
      entityId: applicationId,
      entityName: fileName,
      description: `Uploaded resume ${fileName} for ${applicationTitle}`,
      metadata: { fileName },
      applicationId,
    });
  }

  static async trackDashboardViewed() {
    await this.trackActivity({
      type: ActivityType.DASHBOARD_VIEWED,
      action: "viewed",
      entityType: EntityType.DASHBOARD,
      entityId: "dashboard",
      description: "Viewed dashboard",
    });
  }

  static async trackLogin() {
    await this.trackActivity({
      type: ActivityType.LOGIN,
      action: "login",
      entityType: EntityType.USER,
      entityId: "session",
      description: "User logged in",
    });
  }

  static async trackLogout() {
    await this.trackActivity({
      type: ActivityType.LOGOUT,
      action: "logout",
      entityType: EntityType.USER,
      entityId: "session",
      description: "User logged out",
    });
  }

  // Query methods for retrieving activities
  static async getUserActivities(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        application: {
          select: { title: true, company: { select: { name: true } } },
        },
        company: {
          select: { name: true },
        },
        contact: {
          select: { name: true },
        },
        interview: {
          select: { type: true, application: { select: { title: true } } },
        },
        note: {
          select: { type: true },
        },
        offer: {
          select: { title: true },
        },
      },
    });
  }

  static async getUserActivityStats(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      select: {
        type: true,
        entityType: true,
        createdAt: true,
      },
    });

    // Group by type and entity type for stats
    const typeStats = activities.reduce(
      (acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const entityStats = activities.reduce(
      (acc, activity) => {
        acc[activity.entityType] = (acc[activity.entityType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalActivities: activities.length,
      typeStats,
      entityStats,
      period: `${days} days`,
    };
  }

  // Status transition analysis methods for Sankey diagrams
  static async getUserStatusTransitions(userId: string, days?: number) {
    const whereClause: Prisma.ActivityWhereInput = {
      userId,
      type: ActivityType.APPLICATION_STATUS_CHANGED,
    };

    if (days) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      whereClause.createdAt = { gte: since };
    }

    // Use fast groupBy query with indexed columns
    const transitions = await prisma.activity.groupBy({
      by: ["fromStatus", "toStatus"],
      where: whereClause,
      _count: { id: true },
      orderBy: [{ fromStatus: "asc" }, { toStatus: "asc" }],
    });

    return transitions.map((t) => ({
      fromStatus: t.fromStatus,
      toStatus: t.toStatus!,
      count: t._count.id,
    }));
  }

  static async generateUserSankeyData(
    userId: string,
    days?: number,
  ): Promise<SankeyData> {
    const transitions = await this.getUserStatusTransitions(userId, days);
    return generateSankeyData(transitions);
  }

  static async getApplicationStatusHistory(applicationId: string) {
    const statusActivities = await prisma.activity.findMany({
      where: {
        applicationId,
        type: ActivityType.APPLICATION_STATUS_CHANGED,
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        fromStatus: true,
        toStatus: true,
        isProgression: true,
        stageOrder: true,
        metadata: true,
        description: true,
        createdAt: true,
      },
    });

    return statusActivities.map((activity) => {
      const metadata = activity.metadata as Record<string, unknown>;
      return {
        id: activity.id,
        fromStatus: activity.fromStatus,
        toStatus: activity.toStatus!,
        reason: metadata?.reason as string | undefined,
        isProgression: activity.isProgression!,
        stageOrder: activity.stageOrder!,
        transitionType: metadata?.transitionType as string,
        description: activity.description,
        transitionAt: activity.createdAt,
      };
    });
  }

  // Get status transition analytics
  static async getStatusTransitionStats(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Fast aggregation queries using indexed columns
    const [totalTransitions, progressiveTransitions, finalStatuses] =
      await Promise.all([
        // Total transitions count
        prisma.activity.count({
          where: {
            userId,
            type: ActivityType.APPLICATION_STATUS_CHANGED,
            createdAt: { gte: since },
          },
        }),

        // Progressive transitions count
        prisma.activity.count({
          where: {
            userId,
            type: ActivityType.APPLICATION_STATUS_CHANGED,
            isProgression: true,
            createdAt: { gte: since },
          },
        }),

        // Group by final status
        prisma.activity.groupBy({
          by: ["toStatus"],
          where: {
            userId,
            type: ActivityType.APPLICATION_STATUS_CHANGED,
            createdAt: { gte: since },
          },
          _count: { id: true },
        }),
      ]);

    const conversionRate =
      totalTransitions > 0
        ? (progressiveTransitions / totalTransitions) * 100
        : 0;

    const finalStatusesMap = finalStatuses.reduce(
      (acc, { toStatus, _count }) => {
        if (toStatus) {
          acc[toStatus] = _count.id;
        }
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    return {
      totalTransitions,
      progressiveTransitions,
      conversionRate,
      finalStatuses: finalStatusesMap,
      period: `${days} days`,
    };
  }
}
