import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
    id: string;
    role: 'user' | 'nova';
    content: string;
    created_at: string;
}

const NovaRemote = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel('nova_remote_chat')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'nova_chat_messages'
            }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages(prev => [...prev, newMessage]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('nova_chat_messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load chat history");
        } else {
            setMessages(data || []);
        }
    };

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setIsLoading(true);

        try {
            // 1. Save user message to Supabase
            const { data: userMsgData, error: userError } = await supabase
                .from('nova_chat_messages')
                .insert([{
                    role: 'user',
                    content: userMessage
                }])
                .select()
                .single();

            if (userError) throw userError;

            // 2. Call Supabase Edge Function for AI Response
            const { data, error: aiError } = await supabase.functions.invoke('nova-assistant', {
                body: {
                    messages: messages.concat({ role: 'user', content: userMessage } as any).map(m => ({
                        role: m.role === 'nova' ? 'assistant' : 'user',
                        content: m.content
                    })),
                    sessionId: 'nova-remote-session'
                }
            });

            if (aiError) throw aiError;

            // 3. Save Nova's response to Supabase
            if (data?.reply) {
                await supabase
                    .from('nova_chat_messages')
                    .insert([{
                        role: 'nova',
                        content: data.reply
                    }]);
            }

        } catch (error) {
            console.error("Error in Nova Assistant:", error);
            toast.error("Failed to get response from Nova");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="p-4 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Nova Remote</h1>
                        <p className="text-xs text-white/50">Mobile Coordination Bridge</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Live Sync</span>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full p-4">
                    <div className="max-w-2xl mx-auto space-y-6 pb-20">
                        {messages.length === 0 && (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                    <Bot className="w-10 h-10 text-white/20" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-white/80">Start coordinating with Nova</h2>
                                    <p className="text-sm text-white/40 max-w-xs mx-auto mt-2">
                                        Send instructions or requests here while you are away. Nova will read them and respond.
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800 border border-white/10' : 'bg-purple-600'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-zinc-900 text-white rounded-tr-none'
                                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <span className="text-[10px] text-white/20 mt-1 block">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Ambient Gradients */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                </div>
            </main>

            {/* Input */}
            <footer className="p-4 pb-8 border-t border-white/10 bg-black/80 backdrop-blur-xl">
                <form
                    onSubmit={sendMessage}
                    className="max-w-2xl mx-auto flex gap-2 relative"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="Type your instruction to Nova..."
                        className="bg-white/5 border-white/10 focus:border-purple-500 transition-all rounded-xl h-12 pr-12"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 h-10 w-10 bg-purple-600 hover:bg-purple-700 transition-all rounded-lg"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
                <p className="text-center text-[10px] text-white/20 mt-2 uppercase tracking-tight">
                    Nova Remote Coordination Layer v1.0
                </p>
            </footer>
        </div>
    );
};

export default NovaRemote;
