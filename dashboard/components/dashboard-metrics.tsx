"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, MessageSquare, Clock, ThumbsUp, ThumbsDown, BarChart, TrendingUp } from "lucide-react"
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
);
// This would be replaced with actual Supabase data
type DashboardMetrics = {
  total_unique_users: number
  total_conversations: number
  total_messages: number
  today_new_users: number
  today_conversations: number
  today_messages: number
  total_feedback: number
  positive_feedback: number
  negative_feedback: number
  satisfaction_rate: number
  avg_response_time_ms: number
  today_avg_response_time_ms: number
  converted_conversations: number
  conversion_rate: number
}
export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_unique_users: 0,
    total_conversations: 0,
    total_messages: 0,
    today_new_users: 0,
    today_conversations: 0,
    today_messages: 0,
    total_feedback: 0,
    positive_feedback: 0,
    negative_feedback: 0,
    satisfaction_rate: 0,
    avg_response_time_ms: 0,
    today_avg_response_time_ms: 0,
    converted_conversations: 0,
    conversion_rate: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with actual Supabase fetch
    const fetchDashboardMetrics = async () => {
      try {
        // Replace with actual Supabase client call
        const { data, error } = await supabase
          .from('mv_realtime_dashboard')
          .select('*')
          .single();

        if (error) throw error;

        // Simulating data for now
    

        setMetrics(data)
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [])

  const formatTime = (ms: number) => {
    if (ms < 1000 && ms != null) return `${ms.toFixed(2).replace(/\.?0+$/, "")}ms`;
    return `${(ms / 1000).toFixed(2).replace(/\.?0+$/, "")}s`;
  };


  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card id="total-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.total_unique_users.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Unique users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.total_conversations.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Messages
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.total_messages.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(metrics.avg_response_time_ms)}
              </div>
              <p className="text-xs text-muted-foreground">All time average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfaction Rate
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.satisfaction_rate * 100).toFixed(2).replace(/\.?0+$/, "")}%
              </div>

              <p className="text-xs text-muted-foreground">Based on feedback</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.conversion_rate * 100).toFixed(2).replace(/\.?0+$/, "")}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of total conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Converted Convos
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.converted_conversations.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Total converted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.total_feedback.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Received feedback</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="today" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Users Today
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.today_new_users.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">New signups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.today_conversations.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">New conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Messages
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.today_messages.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Total messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(metrics.today_avg_response_time_ms)}
              </div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Positive Feedback
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.positive_feedback.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Happy users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Negative Feedback
              </CardTitle>
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.negative_feedback.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Unhappy users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfaction Rate
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.satisfaction_rate *100).toFixed(2).replace(/\.?0+$/, "")}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall satisfaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.total_feedback.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Feedback received</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
