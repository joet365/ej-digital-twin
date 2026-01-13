import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, User, Bot } from "lucide-react";
import { format } from "date-fns";

interface Conversation {
  id: string;
  lead_id: string | null;
  call_id: string | null;
  duration_seconds: number | null;
  started_at: string | null;
  ended_at: string | null;
  summary: string | null;
  recording_url: string | null;
  created_at: string;
}

interface TranscriptMessage {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading } = useAdminAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && id) {
      fetchData();
    }
  }, [authLoading, id]);

  const fetchData = async () => {
    // Fetch conversation
    const { data: convData } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (convData) {
      setConversation(convData as Conversation);
    }

    // Fetch transcript messages
    const { data: msgData } = await supabase
      .from('transcript_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('timestamp', { ascending: true });

    if (msgData) {
      setMessages(msgData as TranscriptMessage[]);
    }

    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to={conversation.lead_id ? `/admin/leads/${conversation.lead_id}` : '/admin'} 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Conversation Details</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Conversation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Call Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">
                  {conversation.started_at ? format(new Date(conversation.started_at), 'PPpp') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {conversation.duration_seconds ? `${conversation.duration_seconds} seconds` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Call ID</p>
                <p className="font-medium font-mono text-xs">{conversation.call_id || '-'}</p>
              </div>
            </div>

            {/* Recording */}
            {conversation.recording_url && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Recording</p>
                <audio controls className="w-full">
                  <source src={conversation.recording_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {conversation.summary && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{conversation.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Transcript */}
        <Card>
          <CardHeader>
            <CardTitle>Transcript ({messages.length} messages)</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-muted-foreground">No transcript available</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`flex-1 max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'assistant' ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      <p className="text-sm text-foreground">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(msg.timestamp), 'HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConversationDetail;
