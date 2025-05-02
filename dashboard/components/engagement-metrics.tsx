"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, BarChart } from "lucide-react"

// This would be replaced with actual Supabase data
type EngagementMetrics = {
  total_conversations: number
  total_users: number
  total_messages: number
  avg_response_time_ms: number
  positive_feedback: number
  negative_feedback: number
  satisfaction_rate: number
}
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://useoorbxepjlwnewlbjl.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZW9vcmJ4ZXBqbHduZXdsYmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MjAwNTksImV4cCI6MjA2MTQ5NjA1OX0.pmkl2UIZyNfsTh9oJaKt9h-RmdK-1FWvY7kFE_PqbaY"
);
export function EngagementMetrics() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    total_conversations: 0,
    total_users: 0,
    total_messages: 0,
    avg_response_time_ms: 0,
    positive_feedback: 0,
    negative_feedback: 0,
    satisfaction_rate: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with actual Supabase fetch
    const fetchEngagementMetrics = async () => {
      try {
        // Replace with actual Supabase client call
        const { data, error } = await supabase
          .from('mv_user_engagement')
          .select('*')
          .single();

        if (error) throw error;
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching engagement metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementMetrics()
  }, [])

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">User Engagement</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages per User</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.total_users ? (metrics.total_messages / metrics.total_users).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average messages per user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages per Conversation</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.total_conversations ? (metrics.total_messages / metrics.total_conversations).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average message count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations per User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.total_users ? (metrics.total_conversations / metrics.total_users).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average conversations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
