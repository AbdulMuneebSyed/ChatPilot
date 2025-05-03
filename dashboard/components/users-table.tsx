"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare } from "lucide-react"
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "",
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
);
type Conversation = {
  conversation_id: string | null
  email: string | null
  session_id: string | null
  is_active: boolean | null
  last_activity: string | null
  conversation_duration_minutes: number | null
  message_count: number | null
  user_messages: number | null
  assistant_messages: number | null
  avg_response_time_ms: number | null
  feedback_status: string | null
}

export function UsersTable() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data: metrics, error: metricsError } = await supabase
          .from("mv_conversation_metrics")
          .select("*")
          .order("last_activity", { ascending: false });

        if (metricsError) throw metricsError;

        const { data: conversationsData, error: conversationsError } =
          await supabase
            .from("conversations")
            .select("email,session_id,is_active");

        if (conversationsError) throw conversationsError;

        // Merge both datasets on conversation_id
        const merged = metrics.map((metric) => {
          const convo = conversationsData.find(
            (c) => c.email === metric.email
          );
          return {
            ...metric,
            email: convo?.email ?? null,
            session_id: convo?.session_id ?? null,
            is_active: convo?.is_active ?? null,
          };
        });

        setConversations(merged);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);


  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      (conversation.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (conversation.conversation_id?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (conversation.session_id?.toLowerCase().includes(searchQuery.toLowerCase()) || false),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or session ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="text-left">See Conversation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredConversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No conversations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredConversations.map((conversation) => (
                <TableRow key={conversation.conversation_id}>
                  <TableCell className="font-medium">{conversation.email}</TableCell>
                  <TableCell>
                    <Badge variant={conversation.is_active ? "success" : "secondary"}>
                      {conversation.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{conversation.last_activity ? formatDate(conversation.last_activity) : "N/A"}</TableCell>
                  <TableCell>{conversation.conversation_duration_minutes} min</TableCell>
                  <TableCell>{conversation.message_count}</TableCell>
                  <TableCell>{formatTime(conversation.avg_response_time_ms ?? 0)}</TableCell>
                  <TableCell>
                    {conversation.feedback_status ? (
                      <Badge variant={conversation.feedback_status === "positive" ? "success" : "destructive"}>
                        {conversation.feedback_status}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/conversations/${conversation.conversation_id}`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">View conversation</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
