import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "@/components/layout/PageLayout";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const leadFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(50, "Phone must be less than 50 characters").regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  website: z.string().trim().url("Please enter a valid URL (include https://)").max(500, "URL must be less than 500 characters"),
  companyName: z.string().trim().min(1, "Company name is required").max(255, "Company name must be less than 255 characters")
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const AgentOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      companyName: ""
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('submit-lead', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          companyName: data.companyName
        }
      });
      if (response.error) throw new Error(response.error.message || "Failed to submit lead");

      const result = response.data;
      if (!result.success) throw new Error(result.error || "Failed to create lead");

      if (result.redirect && result.agentId) {
        toast({ title: "Welcome back!", description: "Taking you to your existing demo..." });
        navigate(`/demo?agentId=${result.agentId}&name=${encodeURIComponent(result.name || data.name)}`);
        return;
      }

      navigate(`/loading?leadId=${result.leadId}&name=${encodeURIComponent(data.name)}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <StepCard currentStep={1}>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-shrink-0 text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-3">
              <img src="/lovable-uploads/1764714680507.png" alt="Kate - AI Receptionist" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              Never Miss Another Customer Call Again
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-4">
              Your AI receptionist answers every call instantly, 24/7. Trained on <span className="font-semibold text-foreground">YOUR business</span> in 60 seconds.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">🎯 Here's How It Works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <p className="font-medium text-foreground">Enter Your Info</p>
                <p className="text-sm text-muted-foreground">We instantly scrape your website</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <p className="font-medium text-foreground">Kate Learns Your Business</p>
                <p className="text-sm text-muted-foreground">Trained on your services & FAQs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <p className="font-medium text-foreground">Talk to Kate</p>
                <p className="text-sm text-muted-foreground">Test her knowledge—FREE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <p className="text-lg font-semibold text-foreground mb-1">✨ Test Kate for FREE—No Credit Card Required</p>
          <p className="text-sm text-muted-foreground">See how Kate answers questions about YOUR business. Enter your information below and talk to her in 60 seconds.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Get Instant Access</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Your Website <span className="text-sm text-muted-foreground">(We'll train Kate on this)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://yourwebsite.com" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-foreground font-medium">Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="ghost" onClick={() => navigate("/login")} className="text-primary hover:text-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>

              <Button type="submit" variant="gradient" size="lg" disabled={isLoading}>
                {isLoading ? <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Lead...
                </> : <>
                  Talk to Kate Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>}
              </Button>
            </div>
          </form>
        </Form>
      </StepCard>
    </PageLayout>
  );
};

export default AgentOnboarding;