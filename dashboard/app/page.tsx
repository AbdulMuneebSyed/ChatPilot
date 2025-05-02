import { DashboardMetrics } from "@/components/dashboard-metrics"
import { EngagementMetrics } from "@/components/engagement-metrics"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardMetrics />
      <EngagementMetrics />
    </div>
  )
}
