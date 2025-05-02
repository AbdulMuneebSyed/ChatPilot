import { ConversationView } from "@/components/conversation-view"

export default function ConversationPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="flex flex-col h-full">
      <ConversationView conversationId={params.id} />
    </div>
  )
}
