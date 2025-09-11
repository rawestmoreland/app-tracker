import { ApplicationStatus } from '@prisma/client';

// Define the typical progression flow with stage ordering
export const APPLICATION_FLOW_STAGES: Record<
  ApplicationStatus,
  { order: number; isTerminal: boolean; isPositive: boolean }
> = {
  DRAFT: { order: 0, isTerminal: false, isPositive: true },
  APPLIED: { order: 1, isTerminal: false, isPositive: true },
  CONFIRMATION_RECEIVED: { order: 2, isTerminal: false, isPositive: true },
  UNDER_REVIEW: { order: 3, isTerminal: false, isPositive: true },
  PHONE_SCREEN: { order: 4, isTerminal: false, isPositive: true },
  TECHNICAL_INTERVIEW: { order: 5, isTerminal: false, isPositive: true },
  ONSITE_INTERVIEW: { order: 6, isTerminal: false, isPositive: true },
  REFERENCE_CHECK: { order: 7, isTerminal: false, isPositive: true },
  OFFER_RECEIVED: { order: 8, isTerminal: false, isPositive: true },
  OFFER_NEGOTIATING: { order: 9, isTerminal: false, isPositive: true },
  ACCEPTED: { order: 10, isTerminal: true, isPositive: true }, // Successfully hired!

  // Terminal negative outcomes (can happen at any stage)
  REJECTED: { order: -1, isTerminal: true, isPositive: false },
  WITHDRAWN: { order: -2, isTerminal: true, isPositive: false },
  GHOSTED: { order: -3, isTerminal: true, isPositive: false },
  POSITION_FILLED: { order: -4, isTerminal: true, isPositive: false },
};

/**
 * Determines if a status transition represents forward progression
 */
export function isProgressiveTransition(
  fromStatus: ApplicationStatus | null,
  toStatus: ApplicationStatus,
): boolean {
  // If no previous status, this is initial application
  if (!fromStatus) {
    return toStatus === 'APPLIED' || toStatus === 'DRAFT';
  }

  const fromStage = APPLICATION_FLOW_STAGES[fromStatus];
  const toStage = APPLICATION_FLOW_STAGES[toStatus];

  // Positive terminal states (ACCEPTED) are always progressive
  if (toStage.isTerminal && toStage.isPositive) {
    return true;
  }

  // Negative terminal states are never progressive
  if (toStage.isTerminal && !toStage.isPositive) {
    return false;
  }

  // For non-terminal states, check if we're moving forward in the flow
  return toStage.order > fromStage.order;
}

/**
 * Gets the stage order for a given status (used for sankey diagram positioning)
 */
export function getStageOrder(status: ApplicationStatus): number {
  return APPLICATION_FLOW_STAGES[status].order;
}

/**
 * Determines if a status is a terminal state (end of the application process)
 */
export function isTerminalStatus(status: ApplicationStatus): boolean {
  return APPLICATION_FLOW_STAGES[status].isTerminal;
}

/**
 * Determines if a status represents a positive outcome
 */
export function isPositiveStatus(status: ApplicationStatus): boolean {
  return APPLICATION_FLOW_STAGES[status].isPositive;
}

/**
 * Gets all possible next statuses from a given status
 */
export function getPossibleNextStatuses(
  currentStatus: ApplicationStatus,
): ApplicationStatus[] {
  const currentStage = APPLICATION_FLOW_STAGES[currentStatus];

  // If terminal, no next statuses
  if (currentStage.isTerminal) {
    return [];
  }

  // Get all statuses with higher order (forward progression)
  const progressiveStatuses = Object.entries(APPLICATION_FLOW_STAGES)
    .filter(
      ([_, stage]) => stage.order > currentStage.order && !stage.isTerminal,
    )
    .map(([status]) => status as ApplicationStatus);

  // Add terminal statuses (can always move to rejected/withdrawn/etc.)
  const terminalStatuses = Object.entries(APPLICATION_FLOW_STAGES)
    .filter(([_, stage]) => stage.isTerminal)
    .map(([status]) => status as ApplicationStatus);

  return [...progressiveStatuses, ...terminalStatuses];
}
