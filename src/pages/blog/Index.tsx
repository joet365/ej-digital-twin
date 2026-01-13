import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image?: string;
}

// Example blog posts (will be replaced with dynamic data)
const blogPosts: BlogPost[] = [
    {
        slug: "what-is-ai-receptionist",
        title: "The Complete Guide to AI Receptionists in 2025",
        excerpt: "Learn how AI receptionists are revolutionizing business communication. Discover benefits, costs, and how to implement this technology for 24/7 lead capture.",
        date: "2025-12-13",
        category: "AI Automation",
        readTime: "8 min",
    },
    {
        slug: "ai-receptionist-roi-calculator",
        title: "How AI Receptionists Save $75,000/Year",
        excerpt: "Discover how AI receptionists can save your business thousands in missed opportunities and operational costs.",
        date: "2024-12-13",
        category: "Business Growth",
        readTime: "7 min",
    },
    {
        slug: "kate-vs-traditional-receptionist",
        title: "Kate vs Traditional Receptionist: Which is Better?",
        excerpt: "Compare AI receptionists like Kate with traditional receptionists. See costs, benefits, and which is right for your business.",
        date: "2024-12-12",
        category: "Kate Features",
        readTime: "6 min",
    },
];

const BlogIndex = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 pt-32">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Conquer365 Blog</h1>
                    <p className="text-xl text-blue-100 max-w-2xl">
                        Insights on AI automation, business growth, and how Kate AI Receptionist helps businesses capture every opportunity.
                    </p>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="secondary">{post.category}</Badge>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default BlogIndex;
