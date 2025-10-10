'use client';

import { useEffect, useState, useRef } from 'react';
import { transformApplicationFlowToSankeyData } from '@/lib/utils/sankey-data';
import { getApplicationFlowData } from '@/lib/actions/sankey-actions';
import { SankeyData, ApplicationFlowData } from '@/lib/types/sankey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SankeyChart from './sankey-chart';
import { shareApplicationFlow } from '@/lib/utils/share-flow';
import { toast } from 'sonner';

export default function ApplicationFlowChart() {
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const [flowData, setFlowData] = useState<ApplicationFlowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicationFlowData();
      setFlowData(data);

      if (data.length > 0) {
        const sankeyData = transformApplicationFlowToSankeyData(data);
        setSankeyData(sankeyData);
      } else {
        setSankeyData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalApplications = flowData.reduce((sum, flow) => sum + flow.count, 0);
  const uniqueStatuses = new Set([
    ...flowData.map((f) => f.fromStatus),
    ...flowData.map((f) => f.toStatus),
  ]).size;

  const handleShare = async () => {
    if (!chartRef.current) {
      toast.error('Unable to capture chart. Please try again.');
      return;
    }

    setIsSharing(true);
    try {
      await shareApplicationFlow({ element: chartRef.current });
      toast.success('Application flow image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Application Flow
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Visualizes how your applications flow through different statuses
              </p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Application Flow
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" className="mt-2" onClick={loadData}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sankeyData || sankeyData.nodes.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Application Flow
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-2 text-sm">
              No application flow data available yet
            </p>
            <p className="text-muted-foreground text-xs">
              Status changes will appear here as you update your applications
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            Application Flow
          </CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            Track how your applications progress through different statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing || loading}
              >
                <Share2 className={`h-4 w-4 ${isSharing ? 'animate-pulse' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share as image</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          <SankeyChart data={sankeyData} height={400} />

          {/* Legend */}
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {sankeyData.nodes.map((node) => (
                <div key={node.id} className="flex items-center gap-1">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {node.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
