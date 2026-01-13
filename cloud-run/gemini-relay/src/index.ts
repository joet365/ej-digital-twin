import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { ToolHandler } from './tools';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Initialize Supabase admin client and Tool Handler
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const toolHandler = new ToolHandler(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Create HTTP server for health check and WS upgrade
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }
    res.writeHead(404);
    res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
    const requestUrl = url.parse(req.url || '', true);
    const agentId = requestUrl.query.agentId as string || '00000000-0000-0000-0000-000000000001';

    console.log(`[Relay] New connection for agent: ${agentId}`);

    let geminiWs: WebSocket | null = null;

    try {
        // 1. Fetch Agent Config
        const { data: agent, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agentError || !agent) {
            console.error('[Relay] Error fetching agent:', agentError);
            ws.close(1008, 'Agent not found');
            return;
        }

        const systemInstructionText = agent.system_prompt;

        // 2. Connect to Gemini Live API
        // Using the same endpoint as the Deno version
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;

        geminiWs = new WebSocket(geminiUrl);

        geminiWs.on('open', () => {
            console.log('[Relay] Connected to Gemini API');

            // Send Setup Payload with Tools
            const setupPayload = {
                setup: {
                    model: "models/gemini-2.0-flash-exp",
                    systemInstruction: {
                        parts: [{ text: systemInstructionText }]
                    },
                    generationConfig: {
                        responseModalities: ["AUDIO"]
                    },
                    tools: [
                        { functionDeclarations: toolHandler.getToolDeclarations() }
                    ]
                }
            };

            geminiWs?.send(JSON.stringify(setupPayload));
        });

        geminiWs.on('message', async (data: WebSocket.Data) => {
            // Relay from Gemini to Client
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    const geminiMsg = JSON.parse(data.toString());

                    // Check for Tool Calls from Gemini
                    if (geminiMsg.serverContent?.modelTurn?.parts) {
                        for (const part of geminiMsg.serverContent.modelTurn.parts) {
                            if (part.functionCall) {
                                const { name, args, callId } = part.functionCall;

                                // Execute tool locally
                                const result = await toolHandler.handleToolCall(agentId, name, args);

                                // Send tool response back to Gemini
                                const responsePayload = {
                                    toolResponse: {
                                        functionResponses: [{
                                            name,
                                            response: { result },
                                            id: callId
                                        }]
                                    }
                                };
                                geminiWs?.send(JSON.stringify(responsePayload));
                                return; // Don't relay the raw tool call to client
                            }
                        }
                    }

                    ws.send(data);
                } catch (e) {
                    ws.send(data);
                }
            }
        });

        geminiWs.on('error', (err) => {
            console.error('[Relay] Gemini WS Error:', err);
            ws.close(1011, 'Gemini connection error');
        });

        geminiWs.on('close', () => {
            console.log('[Relay] Gemini connection closed');
            ws.close();
        });

        // 3. Relay from Client to Gemini
        ws.on('message', (data) => {
            if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                try {
                    const message = JSON.parse(data.toString());

                    // Handle multimodal input parts (audio and images)
                    if (message.realtimeInput?.mediaChunks) {
                        // This relays both audio/pcm and image/jpeg if sent by client
                        geminiWs.send(data);
                    } else {
                        // Standard text or other messages
                        geminiWs.send(data);
                    }
                } catch (e) {
                    // If not JSON, just relay as is (e.g. binary)
                    geminiWs.send(data);
                }
            }
        });

        ws.on('close', () => {
            console.log('[Relay] Client connection closed');
            if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                geminiWs.close();
            }
        });

        ws.on('error', (err) => {
            console.error('[Relay] Client WS Error:', err);
            if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                geminiWs.close();
            }
        });

    } catch (error) {
        console.error('[Relay] Fatal error:', error);
        ws.close(1011, 'Internal server error');
    }
});

server.listen(PORT, () => {
    console.log(`[Relay] Server listening on port ${PORT}`);
    console.log(`[Relay] Health check available at http://localhost:${PORT}/health`);
});
