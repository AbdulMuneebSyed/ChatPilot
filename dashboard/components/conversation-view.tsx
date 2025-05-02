"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MessageSquare, ThumbsUp, ThumbsDown, User } from "lucide-react"
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
// This would be replaced with actual Supabase data
type Message = {
  id: string
  conversation_id: string
  session_id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

type ConversationMetrics = {
  conversation_id: string
  email: string
  last_activity: string
  conversation_duration_minutes: number
  message_count: number
  user_messages: number
  assistant_messages: number
  avg_response_time_ms: number
  feedback_status: string | null
}

export function ConversationView({ conversationId }: { conversationId: string }) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [metrics, setMetrics] = useState<ConversationMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with actual Supabase fetch
    const fetchConversation = async () => {
      try {
        // Replace with actual Supabase client calls
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        const { data: metricsData, error: metricsError } = await supabase
          .from('mv_conversation_metrics')
          .select('*')
          .eq('conversation_id', conversationId)
          .single();

        if (metricsError) throw metricsError;

        // Simulating data for now
       
        setMessages(messagesData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching conversation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversation()
  }, [conversationId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/users")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{metrics?.email}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{metrics?.message_count} messages</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{metrics?.conversation_duration_minutes} minutes</span>
              </div>
              {metrics?.feedback_status && (
                <Badge variant={metrics.feedback_status === "positive" ? "success" : "destructive"}>
                  {metrics.feedback_status === "positive" ? (
                    <ThumbsUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ThumbsDown className="mr-1 h-3 w-3" />
                  )}
                  {metrics.feedback_status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex max-w-[80%] gap-3">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <Card className={message.role === "user" ? "bg-primary text-primary-foreground" : ""}>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70">{formatTime(message.created_at)}</div>
                    </div>
                  </CardContent>
                </Card>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
