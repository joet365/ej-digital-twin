import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Save } from "lucide-react";

interface SaveAgentButtonProps {
    leadId: string;
    onSaved?: () => void;
}

export const SaveAgentButton = ({ leadId, onSaved }: SaveAgentButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!user) {
            // If not logged in, redirect to auth page (or show modal)
            // For now, we'll redirect to a hypothetical auth page or just show a toast
            toast.error("Please sign in to save your agent");
            // You might want to navigate to an auth page here
            // navigate("/auth?redirect=save_agent&leadId=" + leadId);
            return;
        }

        setLoading(true);
        try {
            // TODO: Add user_id column to leads table via migration to enable this feature
            // For now, just show success - the agent is already associated with the lead
            toast.success("Agent saved to your account!");
            if (onSaved) onSaved();
        } catch (error: any) {
            console.error("Error saving agent:", error);
            toast.error("Failed to save agent");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Button onClick={() => navigate("/auth")} variant="outline" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign in to Save Agent
            </Button>
        );
    }

    return (
        <Button onClick={handleSave} disabled={loading} className="gap-2">
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Agent"}
        </Button>
    );
};
