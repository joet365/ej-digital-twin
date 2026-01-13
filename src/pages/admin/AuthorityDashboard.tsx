import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Newspaper, Share2, Zap, Brain, Loader2, Play } from "lucide-react";
import { toast } from "sonner";

const AuthorityDashboard = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasResults, setHasResults] = useState(false);

    const startAnalysis = () => {
        setIsProcessing(true);
        toast.info("Ingesting 'House Talk' Podcast...");

        // Simulate complex AI processing for the WOW factor
        setTimeout(() => {
            setIsProcessing(false);
            setHasResults(true);
            toast.success("Authority Engine Sync Complete!");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-slate-100 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Authority Engine <span className="text-indigo-500">Vault</span>
                    </h1>
                    <p className="text-slate-400">Transforming Jeff Scofield's Voice into Digital Assets</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={startAnalysis}
                        disabled={isProcessing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Podcast...</>
                        ) : (
                            <><Mic className="w-4 h-4 mr-2" /> Sync Latest "House Talk" Episode</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Source Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#121216] border-slate-800 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Play className="w-5 h-5 mr-3 text-indigo-400 fill-indigo-400" />
                                Latest Episode
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <p className="text-sm font-medium text-slate-300">Title</p>
                                    <p className="text-lg font-semibold text-white">Market Sanity & Home Inspections</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <p className="text-sm font-medium text-slate-300">Duration</p>
                                        <p className="text-lg font-semibold text-white">24:12</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <p className="text-sm font-medium text-slate-300">Status</p>
                                        <p className="text-lg font-semibold text-green-400">Ready</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#121216] border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white text-lg">
                                <Brain className="w-5 h-5 mr-3 text-purple-400" />
                                Knowledge Base Sync
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                                These "Nuggets" are now part of Kate's brain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                "ADU Investment Strategies",
                                "Home Inspection Deal Killers",
                                "Rochester 2026 Market Forecast",
                                "Negotiation Leverage Tactics"
                            ].map((nugget, i) => (
                                <div key={i} className="flex items-center p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-slate-300 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3 shadow-glow-indigo" />
                                    {nugget}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: AI Assets */}
                <div className="lg:col-span-2">
                    {!hasResults && !isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                            <Brain className="w-16 h-16 mb-4 text-slate-600" />
                            <p className="text-xl font-medium text-slate-400 text-center">
                                Select an episode and click "Sync" to <br />
                                populate your Authority Assets.
                            </p>
                        </div>
                    ) : (
                        <div className={`transition-all duration-700 ${isProcessing ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100 blur-0'}`}>
                            <Tabs defaultValue="article" className="w-full">
                                <TabsList className="bg-slate-900 border-slate-800 w-full justify-start overflow-hidden p-1 rounded-2xl h-14 mb-6">
                                    <TabsTrigger value="article" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-8 rounded-xl flex items-center">
                                        <Newspaper className="w-4 h-4 mr-2" /> SEO Article
                                    </TabsTrigger>
                                    <TabsTrigger value="social" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-full px-8 rounded-xl flex items-center">
                                        <Share2 className="w-4 h-4 mr-2" /> Social Nuggets
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="article" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Card className="bg-[#121216] border-slate-800 p-8 rounded-3xl min-h-[500px]">
                                        <div className="prose prose-invert max-w-none">
                                            <h2 className="text-3xl font-bold text-white mb-6 underline decoration-indigo-500/30 decoration-8 underline-offset-8">
                                                The Secret to 'Market Sanity' in Rochester Real Estate
                                            </h2>
                                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                                In the latest episode of House Talk, Jeff Scofield dives deep into what it means
                                                to maintain sanity in a fast-moving market. Whether you're a first-time homebuyer
                                                or a seasoned investor, the principles remain the same...
                                            </p>
                                            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Why Home Inspections Are Non-Negotiable</h3>
                                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                                Jeff emphasizes that a home inspection isn't just a hurdle—it's your insurance
                                                against future headaches. He shares stories of minor defects that could have
                                                been massive deal-killers if not caught early...
                                            </p>
                                            <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-indigo-300 italic">
                                                "Your home is an asset, but only if you know what's behind the drywall." — Jeff Scofield
                                            </div>
                                        </div>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="social" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="bg-[#121216] border-slate-800 p-6 rounded-2xl">
                                            <Badge className="bg-blue-500/20 text-blue-400 mb-4 border-none">LinkedIn Post</Badge>
                                            <p className="text-slate-200 leading-relaxed italic text-sm">
                                                "Market sanity isn't just about the price—it's about the preparation. 🏠
                                                In our latest House Talk episode, we discuss why the best deal is the one you
                                                understand completely..."
                                            </p>
                                            <Button variant="ghost" className="w-full mt-6 text-slate-400 hover:text-white hover:bg-white/5">
                                                Copy to Clipboard
                                            </Button>
                                        </Card>
                                        <Card className="bg-[#121216] border-slate-800 p-6 rounded-2xl border-l-4 border-pink-500/50">
                                            <Badge className="bg-pink-500/20 text-pink-400 mb-4 border-none">IG Caption</Badge>
                                            <p className="text-slate-200 leading-relaxed italic text-sm">
                                                "Your home, your voice. We're turning podcast insights into real estate
                                                wins. ✨ #RochesterRealEstate #HouseTalk"
                                            </p>
                                            <Button variant="ghost" className="w-full mt-6 text-slate-400 hover:text-white hover:bg-white/5">
                                                Copy to Clipboard
                                            </Button>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorityDashboard;
