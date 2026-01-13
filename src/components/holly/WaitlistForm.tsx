import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use edge function for rate limiting and server-side validation
      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          name: 'Holly Waitlist',
          email: email.trim(),
          phone: '',
          website: 'holly-waitlist',
          companyName: 'Holly Waitlist'
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "You're on the list!",
        description: "We'll be in touch soon with early access details.",
      });
      setEmail("");
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 px-5 text-base bg-card border-2 border-border focus:border-[hsl(16,85%,58%)] rounded-xl"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 px-8 bg-gradient-to-r from-[hsl(16,85%,58%)] to-[hsl(30,90%,65%)] hover:from-[hsl(16,85%,48%)] hover:to-[hsl(30,90%,55%)] text-white rounded-xl font-semibold shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Join the Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        No spam. Just early access and special pricing for founding agents.
      </p>
    </form>
  );
}
