
import { useState } from "react";
import { GeminiLiveButton } from "@/components/chat/GeminiLiveButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const PhoneSimulator = () => {
    const [isConnected, setIsConnected] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <Card className="p-8 shadow-xl border-slate-200 bg-white text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-8 h-8 text-blue-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">Phone Simulator</h1>
                    <p className="text-slate-600">
                        This page simulates an inbound phone call to your AI Receptionist.
                        It uses the exact same script as the phone line, but runs over the web to save credits.
                    </p>

                    <div className="py-8 flex justify-center">
                        {/* 
                We use the special agentId 'phone-simulator' here. 
                The backend is configured to recognize this ID and load the Phone Script.
            */}
                        <GeminiLiveButton
                            agentId="00000000-0000-0000-0000-000000000001"
                            className="w-full h-12 text-lg"
                            onConnect={() => setIsConnected(true)}
                            onDisconnect={() => setIsConnected(false)}
                        />
                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Status: {isConnected ? <span className="text-green-600 font-bold">Connected (On Call)</span> : "Ready to Call"}
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default PhoneSimulator;
