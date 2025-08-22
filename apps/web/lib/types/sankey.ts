export interface SankeyNode {
  id: string;
  name: string;
  color?: string;
  depth?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface ApplicationFlowData {
  fromStatus: string;
  toStatus: string;
  count: number;
  applications?: Array<{
    id: string;
    title: string;
    company: string;
    appliedAt: Date;
  }>;
}