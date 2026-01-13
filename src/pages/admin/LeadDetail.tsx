import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  company_name: string | null;
  agent_id: string | null;
  agent_config: any;
  website_content: string | null;
  created_at: string;
}

interface Conversation {
  id: string;
  call_id: string | null;
  duration_seconds: number | null;
  started_at: string | null;
  summary: string | null;
  recording_url: string | null;
  created_at: string;
}

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading } = useAdminAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && id) {
      fetchData();
    }
  }, [authLoading, id]);

  const fetchData = async () => {
    // Fetch lead
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (leadData) {
      setLead(leadData as Lead);
    }

    // Fetch conversations
    const { data: convData } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false });

    if (convData) {
      setConversations(convData as Conversation[]);
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

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Lead not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Lead Info */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{lead.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{lead.company_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary flex items-center gap-1">
                  {lead.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent ID</p>
                <p className="font-medium font-mono text-xs">{lead.agent_id || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(lead.created_at), 'PPpp')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Configuration & Scraped Content */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">System Prompt</h3>
              <div className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                {lead.agent_config && typeof lead.agent_config === 'object' && 'systemPrompt' in lead.agent_config
                  ? (lead.agent_config as any).systemPrompt
                  : 'No system prompt available'}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Scraped Website Content</h3>
              <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {lead.website_content || 'No scraped content available'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations ({conversations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p className="text-muted-foreground">No conversations yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Recording</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell>
                        {conv.started_at ? format(new Date(conv.started_at), 'MMM d, yyyy HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        {conv.duration_seconds ? `${conv.duration_seconds}s` : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {conv.summary || '-'}
                      </TableCell>
                      <TableCell>
                        {conv.recording_url ? (
                          <a href={conv.recording_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Play
                            </Button>
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/conversations/${conv.id}`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LeadDetail;
