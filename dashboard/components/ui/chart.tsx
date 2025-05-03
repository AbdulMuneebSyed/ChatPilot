"use client";

import { Tooltip } from "@/components/ui/tooltip";

import type * as React from "react";
import { cn } from "@/lib/utils";

// Re-export all Recharts components
export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Chart container configuration
export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn("chart-container relative", className)}
      style={
        {
          "--chart-1": "var(--primary)",
          "--chart-2": "hsl(var(--primary) / 0.5)",
          "--chart-3": "hsl(var(--primary) / 0.2)",
          "--chart-4": "hsl(var(--primary) / 0.1)",
          ...Object.entries(config).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [`--color-${key}`]: value.color,
            }),
            {}
          ),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

// Chart tooltip
interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  className?: string;
}

export function ChartTooltip({ className, ...props }: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={false}
      wrapperStyle={{ outline: "none" }}
      content={<ChartTooltipContent />}
      {...props}
    />
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: string | number;
    payload: Record<string, any>;
  }>;
  label?: string;
  indicator?: "dot" | "line";
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="grid gap-1">
          {payload.map((item, index) => {
            const dataKey = item.name || item.dataKey;
            const config = getChartConfig(dataKey);
            const Icon = config?.icon;

            return (
              <div
                key={`item-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                {indicator === "dot" && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        config?.color || `var(--chart-${index + 1})`,
                    }}
                  />
                )}
                {indicator === "line" && (
                  <div
                    className="h-1 w-4"
                    style={{
                      backgroundColor:
                        config?.color || `var(--chart-${index + 1})`,
                    }}
                  />
                )}
                <span className="flex items-center gap-1 capitalize">
                  {Icon && <Icon className="h-3 w-3" />}
                  {config?.label || dataKey}:
                </span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Chart legend
interface ChartLegendProps extends React.ComponentProps<typeof Legend> {
  className?: string;
}

export function ChartLegend({ className, ...props }: ChartLegendProps) {
  return (
    <Legend
      content={<ChartLegendContent />}
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      {...props}
    />
  );
}

interface ChartLegendContentProps {
  payload?: Array<{
    value: string;
    dataKey: string;
    color: string;
    payload: {
      fill: string;
      stroke: string;
      name: string;
      dataKey: string;
    };
  }>;
}

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      {payload.map((entry, index) => {
        const dataKey = entry.value || entry.dataKey;
        const config = getChartConfig(dataKey);
        const Icon = config?.icon;

        return (
          <div
            key={`item-${index}`}
            className="flex items-center gap-1 text-sm"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: config?.color || entry.color,
              }}
            />
            <span className="flex items-center gap-1 capitalize">
              {Icon && <Icon className="h-3 w-3" />}
              {config?.label || dataKey}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to get chart config
function getChartConfig(dataKey: string) {
  const container = document.querySelector(".chart-container");
  if (!container) return null;

  const style = getComputedStyle(container);
  const color = style.getPropertyValue(`--color-${dataKey}`);

  if (!color) return null;

  // Get the config from the data attribute
  const configAttr = container.getAttribute("data-config");
  if (!configAttr) return { color };

  try {
    const config = JSON.parse(configAttr);
    return config[dataKey];
  } catch (error) {
    return { color };
  }
}
