import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Code, Megaphone, Zap, CheckCircle, MessageCircle } from "lucide-react";

import kateHeadshot from "@/assets/kate-headshot.jpg";
import joeHeadshot from "@/assets/joe-headshot.jpg";
import lexiHeadshot from "@/assets/lexi-headshot.jpg";

const AITeam = () => {
    const team = [
        {
            name: "Kate",
            role: "AI Sales Assistant",
            title: "AI Receptionist",
            description: "Kate transforms your phone into your revenue. She engages prospects 24/7, driving qualified meetings and building pipeline.",
            image: kateHeadshot,
            status: "Active",
            icon: Phone,
            color: "from-blue-600 to-purple-600",
            features: [
                "Answers every call 24/7",
                "Captures lead information",
                "Books appointments automatically",
                "Never misses an opportunity"
            ],
            cta: "Hire Kate",
            link: "/kate"
        },
        {
            name: "Joe",
            role: "AI Implementation Expert",
            title: "AI Implementation Specialist",
            description: "Joe learns from every implementation, adapts to your business needs, and elevates your AI transformation around the clock.",
            image: joeHeadshot,
            status: "Autopilot activated",
            icon: Code,
            color: "from-green-600 to-teal-600",
            features: [
                "Technical implementation guidance",
                "Custom AI solution design",
                "Integration with existing systems",
                "Ongoing optimization support"
            ],
            cta: "Hire Joe",
            link: "/joe"
        },
        {
            name: "Lexi",
            role: "AI Content & Social",
            title: "AI Content & Social Media Manager",
            description: "Lexi creates engaging content and manages your social presence. She drives engagement, builds community, and amplifies your brand.",
            image: lexiHeadshot,
            status: "Active",
            icon: Megaphone,
            color: "from-pink-600 to-orange-600",
            features: [
                "Content creation & scheduling",
                "Social media management",
                "Engagement & community building",
                "Analytics & optimization"
            ],
            cta: "Hire Lexi",
            link: "/lexi"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Meet our AI team
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
                        Our AI team doesn't just automate tasks – they transform your business. With 24/7 operations, multilingual capabilities, and human-like intelligence, they're revolutionizing how work gets done.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat with us to get started
                    </Button>
                </div>
            </div>

            {/* AI Team Cards - Vertical Portrait Style */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member) => {
                        const Icon = member.icon;
                        return (
                            <Card key={member.name} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0">
                                {/* Vertical Portrait Image Section (like 11x.ai) */}
                                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-lg">
                                    {/* Placeholder gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10`} />

                                    {/* Portrait Image */}
                                    <img 
                                        src={member.image} 
                                        alt={`${member.name} - ${member.title}`}
                                        className="absolute inset-0 w-full h-full object-cover object-top animate-breathe"
                                    />

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                                            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                            {member.status}
                                        </Badge>
                                    </div>

                                    {/* Demo Preview Overlay (like 11x.ai) */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-xl z-10">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-white" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white">{member.name}</p>
                                                <p className="text-xs text-gray-300">{member.features[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <CardHeader className="pb-3">
                                    <div className="mb-2">
                                        <h3 className="text-2xl font-bold">{member.name}</h3>
                                        <p className="text-sm text-gray-500">{member.title}</p>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed">
                                        {member.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* CTA Button */}
                                    <Link to={member.link}>
                                        <Button
                                            className={`w-full bg-gradient-to-r ${member.color} hover:opacity-90 transition-opacity shadow-lg`}
                                            size="lg"
                                        >
                                            {member.cta} →
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Bottom CTA with Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to build your AI team?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Chat with us to find the perfect AI team member for your business. Get personalized recommendations in minutes.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Start a conversation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AITeam;
