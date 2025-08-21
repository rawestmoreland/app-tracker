'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { SankeyData } from '@/lib/types/sankey';

interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

export default function SankeyChart({ 
  data, 
  width, 
  height = 400 
}: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Handle responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: containerWidth } = entry.contentRect;
        setDimensions({
          width: width || Math.max(600, containerWidth - 40), // Min width of 600px
          height: height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || !data || data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    // Create the sankey generator
    const sankeyGenerator = sankey<any, any>()
      .nodeWidth(15)
      .nodePadding(20)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Prepare the data for d3-sankey
    // Create node index mapping
    const nodeIndexMap = new Map(data.nodes.map((node, index) => [node.id, index]));
    
    const graph = {
      nodes: data.nodes.map(node => ({ ...node })),
      links: data.links.map(link => ({
        ...link,
        source: nodeIndexMap.get(link.source),
        target: nodeIndexMap.get(link.target)
      }))
    };

    // Generate the sankey layout
    sankeyGenerator(graph);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tooltip div
    const tooltip = d3.select('body').selectAll('.sankey-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('padding', '8px 12px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Draw links
    const links = g.append('g')
      .selectAll('.link')
      .data(graph.links)
      .join('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => d.color || '#999')
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .on('mouseover', function(event: any, d: any) {
        d3.select(this).attr('opacity', 0.8);
        tooltip
          .style('opacity', 1)
          .html(`${d.source.name} → ${d.target.name}<br/>${d.value} applications`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.5);
        tooltip.style('opacity', 0);
      });

    // Draw nodes
    const nodes = g.append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .join('g')
      .attr('class', 'node');

    // Node rectangles
    nodes.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => d.color || '#666')
      .attr('stroke', 'none')
      .on('mouseover', function(event: any, d: any) {
        const totalValue = (d.sourceLinks || []).reduce((sum: number, link: any) => sum + link.value, 0) +
                          (d.targetLinks || []).reduce((sum: number, link: any) => sum + link.value, 0);
        
        tooltip
          .style('opacity', 1)
          .html(`${d.name}<br/>${totalValue} applications`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });

    // Node labels
    nodes.append('text')
      .attr('x', (d: any) => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#374151')
      .text((d: any) => d.name);

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-none"
      />
    </div>
  );
}