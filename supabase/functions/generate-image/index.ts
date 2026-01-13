import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateImageRequest {
    prompt: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { prompt }: GenerateImageRequest = await req.json();

        if (!prompt) {
            return new Response(
                JSON.stringify({ error: "Prompt is required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const apiKey = Deno.env.get("GEMINI_API_KEY");
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log("Generating image with prompt:", prompt);

        // Use gemini-2.5-flash-image for image generation (Nano Banana)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            return new Response(
                JSON.stringify({ error: "Image generation failed", details: errorText }),
                { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const data = await response.json();
        console.log("API Response keys:", Object.keys(data));

        // Check for blocked content
        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason === "RECITATION" || finishReason === "SAFETY") {
            return new Response(
                JSON.stringify({
                    error: "Content blocked by safety filter",
                    finishReason: finishReason,
                    suggestion: "Try a different prompt"
                }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Extract image from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        let imageData = null;
        let textResponse = null;

        for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith("image/")) {
                imageData = {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                };
            }
            if (part.text) {
                textResponse = part.text;
            }
        }

        if (imageData) {
            console.log("Image generated successfully");
            return new Response(
                JSON.stringify({
                    success: true,
                    image: imageData,
                    text: textResponse,
                    model: "gemini-2.5-flash-image",
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ error: "No image in response", text: textResponse, rawResponse: data }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("Error in generate-image:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new Response(
            JSON.stringify({ error: "Internal server error", details: errorMessage }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
