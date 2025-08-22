import { ApplicationStatus } from '@prisma/client';
import { SankeyData, SankeyNode, SankeyLink, ApplicationFlowData } from '@/lib/types/sankey';

// Define the typical application flow stages and their colors (inspired by the reference image)
const STATUS_CONFIG = {
  [ApplicationStatus.APPLIED]: { name: 'Applied', color: '#22c55e', order: 0 }, // Green - positive action
  [ApplicationStatus.CONFIRMATION_RECEIVED]: { name: 'Confirmed', color: '#16a34a', order: 1 }, // Darker green
  [ApplicationStatus.UNDER_REVIEW]: { name: 'Under Review', color: '#84cc16', order: 2 }, // Light green
  [ApplicationStatus.PHONE_SCREEN]: { name: 'Phone Screen', color: '#65a30d', order: 3 }, // Medium green
  [ApplicationStatus.TECHNICAL_INTERVIEW]: { name: 'Technical', color: '#4d7c0f', order: 4 }, // Darker green
  [ApplicationStatus.ONSITE_INTERVIEW]: { name: 'Onsite', color: '#365314', order: 5 }, // Deep green
  [ApplicationStatus.REFERENCE_CHECK]: { name: 'Reference Check', color: '#166534', order: 6 }, // Very dark green
  [ApplicationStatus.OFFER_RECEIVED]: { name: 'Offer', color: '#15803d', order: 7 }, // Success green
  [ApplicationStatus.OFFER_NEGOTIATING]: { name: 'Negotiating', color: '#059669', order: 7.5 }, // Teal green
  [ApplicationStatus.ACCEPTED]: { name: 'Accepted', color: '#047857', order: 8 }, // Final success green
  [ApplicationStatus.REJECTED]: { name: 'Rejected', color: '#dc2626', order: 9 }, // Red - negative outcome
  [ApplicationStatus.WITHDRAWN]: { name: 'Withdrawn', color: '#7f1d1d', order: 9 }, // Dark red
  [ApplicationStatus.GHOSTED]: { name: 'Ghosted', color: '#9ca3af', order: 9 }, // Gray - uncertain
  [ApplicationStatus.POSITION_FILLED]: { name: 'Position Filled', color: '#6b7280', order: 9 }, // Gray
  [ApplicationStatus.DRAFT]: { name: 'Draft', color: '#e5e7eb', order: -1 }, // Light gray - initial state
};

// Function to detect and remove cycles in the flow data
function removeCycles(links: SankeyLink[], nodeDepths: Map<string, number>): SankeyLink[] {
  const validLinks: SankeyLink[] = [];
  
  links.forEach(link => {
    // Skip self-loops
    if (link.source === link.target) {
      console.log(`Removing self-loop: ${link.source} -> ${link.target}`);
      return;
    }
    
    const sourceDepth = nodeDepths.get(link.source) || 0;
    const targetDepth = nodeDepths.get(link.target) || 0;
    
    // Only allow links that go forward (from lower depth to higher depth)
    if (sourceDepth < targetDepth) {
      validLinks.push(link);
    } else {
      console.log(`Removing circular/backward link: ${link.source} (depth: ${sourceDepth}) -> ${link.target} (depth: ${targetDepth})`);
    }
  });
  
  return validLinks;
}

export function transformApplicationFlowToSankeyData(flowData: ApplicationFlowData[]): SankeyData {
  const nodeSet = new Set<string>();
  const initialLinks: SankeyLink[] = [];

  // Collect all unique nodes and create initial links
  flowData.forEach(flow => {
    if (flow.count > 0) {
      nodeSet.add(flow.fromStatus);
      nodeSet.add(flow.toStatus);
      
      initialLinks.push({
        source: flow.fromStatus,
        target: flow.toStatus,
        value: flow.count,
        color: getStatusColor(flow.fromStatus, 0.6),
      });
    }
  });

  // Create nodes with proper ordering and colors
  const nodes: SankeyNode[] = Array.from(nodeSet)
    .map(status => {
      // Handle special "CREATED" status for initial flows
      if (status === 'CREATED') {
        return {
          id: status,
          name: 'Created',
          color: '#e5e7eb',
          depth: -2,
        };
      }
      
      return {
        id: status,
        name: STATUS_CONFIG[status as ApplicationStatus]?.name || status,
        color: STATUS_CONFIG[status as ApplicationStatus]?.color || '#6b7280',
        depth: STATUS_CONFIG[status as ApplicationStatus]?.order || 0,
      };
    })
    .sort((a, b) => (a.depth || 0) - (b.depth || 0));

  // Create depth mapping for cycle detection
  const nodeDepths = new Map(nodes.map(node => [node.id, node.depth || 0]));
  
  // Remove circular links
  const links = removeCycles(initialLinks, nodeDepths);

  // Debug: Log the nodes and links to verify structure
  console.log('Sankey nodes:', nodes.map(n => `${n.id} (depth: ${n.depth})`));
  console.log('Sankey links:', links.map(l => `${l.source} -> ${l.target}`));
  console.log(`Removed ${initialLinks.length - links.length} circular/invalid links`);

  // If no valid links remain, return empty data
  if (links.length === 0) {
    console.log('No valid links after cycle removal');
    return { nodes: [], links: [] };
  }

  return { nodes, links };
}

export function getStatusColor(status: string, opacity: number = 1): string {
  const baseColor = STATUS_CONFIG[status as ApplicationStatus]?.color || '#6b7280';
  
  if (opacity === 1) return baseColor;
  
  // Convert hex to rgba
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Helper function to determine if a status transition is a progression or regression
export function isStatusProgression(fromStatus: ApplicationStatus, toStatus: ApplicationStatus): boolean {
  const fromOrder = STATUS_CONFIG[fromStatus]?.order || 0;
  const toOrder = STATUS_CONFIG[toStatus]?.order || 0;
  
  // Terminal states (rejected, withdrawn, etc.) are considered order 9
  const terminalStates: ApplicationStatus[] = [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN, ApplicationStatus.GHOSTED, ApplicationStatus.POSITION_FILLED];
  
  if (terminalStates.includes(toStatus)) return false;
  if (toStatus === ApplicationStatus.ACCEPTED) return true;
  
  return toOrder > fromOrder;
}

// Get meaningful stage groupings for better visualization
export function getStageGroups(): { [key: string]: ApplicationStatus[] } {
  return {
    'Initial': [ApplicationStatus.DRAFT, ApplicationStatus.APPLIED],
    'Early Stage': [ApplicationStatus.CONFIRMATION_RECEIVED, ApplicationStatus.UNDER_REVIEW],
    'Screening': [ApplicationStatus.PHONE_SCREEN],
    'Interviews': [ApplicationStatus.TECHNICAL_INTERVIEW, ApplicationStatus.ONSITE_INTERVIEW],
    'Final Steps': [ApplicationStatus.REFERENCE_CHECK, ApplicationStatus.OFFER_RECEIVED, ApplicationStatus.OFFER_NEGOTIATING],
    'Outcomes': [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN, ApplicationStatus.GHOSTED, ApplicationStatus.POSITION_FILLED],
  };
}