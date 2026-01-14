import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone } from "lucide-react";

interface GeminiLiveButtonProps {
    className?: string; // Kept for future
    agentId?: string;
    sessionId?: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
    systemMessage?: string | null;
    disabled?: boolean;
    onFrameCapture?: (base64: string) => void;
    onTranscription?: (text: string, role: "user" | "model") => void;
    label?: string;
}

export interface GeminiLiveButtonHandle {
    sendText: (text: string) => void;
}

export const GeminiLiveButton = forwardRef<GeminiLiveButtonHandle, GeminiLiveButtonProps>(({ agentId, sessionId, onConnect, onDisconnect, systemMessage, disabled, onFrameCapture, onTranscription, label = "Kate" }, ref) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const workletNodeRef = useRef<AudioNode | null>(null);
    const visionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Audio Output implementation
    const audioQueueRef = useRef<Float32Array[]>([]);
    const isPlayingRef = useRef(false);
    const nextStartTimeRef = useRef(0);

    const connect = async () => {
        console.log("🚀 Gemini connect() triggered");
        try {
            setErrorMsg(null); // Clear previous errors
            setIsConnecting(true);
            // 1. WebSocket Setup
            // -------------------------------------------------------------
            // FIX: HARDCODED CLOUD RUN URL (1-HOUR TIMEOUT)
            // -------------------------------------------------------------
            // We bypass environment variables to ensure we don't fall back 
            // to the 2-minute Supabase Edge Function.
            const CLOUD_RUN_URL = "wss://gemini-twilio-voice-725655992592.us-central1.run.app";
            const wsUrl = `${CLOUD_RUN_URL}?agentId=${agentId || ""}&sessionId=${sessionId || ""}`;
            // -------------------------------------------------------------

            console.log("Connecting to WebSocket URL:", wsUrl);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = async () => {
                console.log("✅ WebSocket Connected Successfully");
                setIsConnected(true);
                setIsConnecting(false);
                if (onConnect) onConnect();

                try {
                    await startAudioInput();
                    // startVisionInput(); // Disabled to allow 15min Audio Session

                    // KEEP ALIVE PING REMOVED (Caused 1007 Protocol Error)
                    // Gemini does not accept { type: "ping" } messages.

                } catch (micError) {
                    const errMsg = micError instanceof Error ? micError.message : String(micError);
                    console.error("Mic Access Failed:", micError);
                    setErrorMsg(`Mic Error: ${errMsg}`);
                    disconnect();
                }
            };

            ws.onerror = (error) => {
                console.error("❌ WebSocket Error Event:", error);
                // Attempt to log more details if possible, though WS errors are often opaque
                setIsConnecting(false);
            };

            ws.onmessage = async (event) => {
                try {
                    let msgData = event.data;
                    if (msgData instanceof Blob) {
                        msgData = await msgData.text();
                    }
                    const data = JSON.parse(msgData);

                    if (data.error) {
                        console.error("Gemini Error:", data.error);
                        setErrorMsg(data.error);
                        return;
                    }

                    // Handle Audio Output
                    if (data.serverContent?.modelTurn?.parts) {
                        for (const part of data.serverContent.modelTurn.parts) {
                            // Audio
                            if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                                const pcmBase64 = part.inlineData.data;
                                playPcmChunk(pcmBase64);
                            }
                        }
                    }

                    if (onTranscription) {
                        if (data.serverContent?.inputTranscription?.text) {
                            onTranscription(data.serverContent.inputTranscription.text, "user");
                        }
                        if (data.serverContent?.outputTranscription?.text) {
                            onTranscription(data.serverContent.outputTranscription.text, "model");
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", event.data);
                }
            };

            ws.onclose = (event) => {
                console.log("WebSocket Closed", event.code, event.reason);
                if (event.code !== 1000 && !errorMsg) {
                    setErrorMsg(`Connection Closed: ${event.code} ${event.reason || "Unknown"}`);
                }
                disconnect();
            };

        } catch (err) {
            console.error("❌ Gemini Connection failed", err);
            setIsConnecting(false);
        }
    };

    useImperativeHandle(ref, () => ({
        sendText: (text: string) => {
            if (isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
                console.log("Sending Silent Selection to Gemini:", text);
                const msg = {
                    clientContent: {
                        turns: [{
                            role: "user",
                            parts: [{ text: text }]
                        }],
                        turnComplete: true
                    }
                };
                wsRef.current.send(JSON.stringify(msg));
            }
        }
    }), [isConnected]);

    // Handle System Message Injection
    useEffect(() => {
        if (systemMessage && isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
            console.log("Sending System Message to Gemini:", systemMessage);
            const msg = {
                clientContent: {
                    turns: [{
                        role: "user",
                        parts: [{ text: systemMessage }]
                    }],
                    turnComplete: true
                }
            };
            wsRef.current.send(JSON.stringify(msg));
        }
    }, [systemMessage, isConnected]);

    const disconnect = () => {
        console.log("🔌 Gemini disconnect() triggered");
        setIsConnected(false);
        setIsConnecting(false);
        if (onDisconnect) onDisconnect();
        wsRef.current?.close();

        // Stop Audio & Vision Input
        streamRef.current?.getTracks().forEach(t => t.stop());
        audioContextRef.current?.close();
        if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);

        wsRef.current = null;
        audioContextRef.current = null;
        visionIntervalRef.current = null;
    };

    const startVisionInput = () => {
        // Create off-screen canvas for frame capture
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
        }

        // Use the existing stream if it has video, or get a new one
        const videoTrack = streamRef.current?.getVideoTracks()[0];

        if (!videoTrack) {
            console.log("No video track found, attempting to get camera access...");
            navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
                .then(vStream => {
                    const vTrack = vStream.getVideoTracks()[0];
                    if (streamRef.current) {
                        streamRef.current.addTrack(vTrack);
                    } else {
                        streamRef.current = vStream;
                    }
                    initVisionInterval();
                })
                .catch(err => console.error("Camera access denied:", err));
        } else {
            initVisionInterval();
        }
    };

    const initVisionInterval = () => {
        if (!videoRef.current) {
            videoRef.current = document.createElement('video');
        }
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();

        visionIntervalRef.current = setInterval(() => {
            captureAndSendFrame();
        }, 1000); // 1 FPS as requested
    };

    const captureAndSendFrame = () => {
        if (!videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = 640;
        canvas.height = 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];

        const msg = {
            realtimeInput: {
                mediaChunks: [{
                    mimeType: "image/jpeg",
                    data: base64Image
                }]
            }
        };

        console.log("📷 Sending Vision Frame");
        wsRef.current.send(JSON.stringify(msg));

        // Send to parent for UI preview
        if (onFrameCapture) onFrameCapture(base64Image);
    };

    const startAudioInput = async () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        await ctx.resume();
        audioContextRef.current = ctx;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        streamRef.current = stream;
        const source = ctx.createMediaStreamSource(stream);

        try {
            console.log("Attempting AudioWorklet...");
            const workletCode = `
                class PCMProcessor extends AudioWorkletProcessor {
                    process(inputs, outputs, parameters) {
                        const input = inputs[0];
                        if (input.length > 0) {
                            const float32 = input[0];
                            const int16 = new Int16Array(float32.length);
                            for (let i = 0; i < float32.length; i++) {
                                const s = Math.max(-1, Math.min(1, float32[i]));
                                int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                            }
                            this.port.postMessage(int16.buffer, [int16.buffer]);
                        }
                        return true;
                    }
                }
                registerProcessor("pcm-processor", PCMProcessor);
            `;
            const blob = new Blob([workletCode], { type: "application/javascript" });
            const blobUrl = URL.createObjectURL(blob);
            await ctx.audioWorklet.addModule(blobUrl);

            const worklet = new AudioWorkletNode(ctx, "pcm-processor");
            worklet.port.onmessage = (e) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const base64 = arrayBufferToBase64(e.data);
                    const msg = {
                        realtimeInput: {
                            mediaChunks: [{
                                mimeType: `audio/pcm;rate=${ctx.sampleRate}`,
                                data: base64
                            }]
                        }
                    };
                    wsRef.current.send(JSON.stringify(msg));
                }
            };
            workletNodeRef.current = worklet;
            source.connect(worklet);
            // worklet.connect(ctx.destination); // Removed to prevent local echo
            console.log("✅ AudioWorklet Started Successfully");

        } catch (workletError) {
            console.warn("⚠️ AudioWorklet failed, falling back to ScriptProcessor:", workletError);

            // Fallback: ScriptProcessorNode (Legacy but reliable)
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcm16 = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }

                    const base64 = arrayBufferToBase64(pcm16.buffer);
                    const msg = {
                        realtimeInput: {
                            mediaChunks: [{
                                mimeType: `audio/pcm;rate=${ctx.sampleRate}`,
                                data: base64
                            }]
                        }
                    };
                    wsRef.current.send(JSON.stringify(msg));
                }
            };

            workletNodeRef.current = processor;
            source.connect(processor);
            // processor.connect(ctx.destination); // Removed to prevent local echo
            console.log("✅ ScriptProcessor Started (Fallback)");
        }
    };

    const playPcmChunk = (base64: string) => {
        if (!audioContextRef.current) return;

        const raw = window.atob(base64);
        const buffer = new ArrayBuffer(raw.length);
        const dataView = new Uint8Array(buffer);
        for (let i = 0; i < raw.length; i++) {
            dataView[i] = raw.charCodeAt(i);
        }
        const int16 = new Int16Array(buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768;
        }

        const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
        audioBuffer.getChannelData(0).set(float32);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);

        const now = audioContextRef.current.currentTime;
        const start = Math.max(now, nextStartTimeRef.current);
        source.start(start);
        nextStartTimeRef.current = start + audioBuffer.duration;
    };

    function arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <Button
                variant={isConnected ? "destructive" : "outline"}
                className={`transition-all ${isConnected ? 'animate-pulse' : ''} bg-indigo-600 hover:bg-indigo-700 text-white w-full`}
                onClick={() => {
                    console.log("Button onClick fired");
                    if (isConnected) disconnect();
                    else connect();
                }}
                disabled={disabled || isConnecting}
                size="sm"
            >
                {isConnected ? (
                    <>
                        <MicOff className="w-4 h-4 mr-2" />
                        End Conversation
                    </>
                ) : isConnecting ? (
                    <>
                        <Mic className="w-4 h-4 mr-2 animate-pulse text-yellow-400" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Phone className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                        Click to talk to Kate
                    </>
                )}
            </Button>
            {errorMsg && (
                <p className="text-xs text-red-500 font-mono mt-2 bg-red-50 p-2 rounded w-full border border-red-200">
                    ⚠️ {errorMsg}
                </p>
            )}
        </div>
    );
});
