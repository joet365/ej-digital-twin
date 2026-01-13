import React from 'react';
import ReactDOM from 'react-dom/client';
import KateChatWidget from './components/KateChatWidget';
import './index.css';

const WIDGET_ID = 'conquer-ai-widget';

function init() {
    // Prevent multiple initializations
    if (document.getElementById(WIDGET_ID)) return;

    // Read configuration from the script tag
    // Example usage: <script src="widget.js" data-agent-id="..." data-company="..." ></script>
    const script = document.currentScript as HTMLScriptElement;

    // Auto-detect base URL from script location if not provided
    // This allows the widget to find "Kate-welcome.mp4" in the same folder as the JS file
    let defaultBaseUrl = "";
    if (script?.src) {
        try {
            defaultBaseUrl = script.src.substring(0, script.src.lastIndexOf('/'));
        } catch (e) {
            console.warn("Could not detect script base URL", e);
        }
    }

    // Configuration
    const agentId = script?.getAttribute('data-agent-id');
    const companyName = script?.getAttribute('data-company-name') || 'Conquer365';
    // Use the confirmed "Conquer365 Assistant" ID as default if not provided
    const defaultAgentId = "00000000-0000-0000-0000-000000000001";
    const vapiPublicKey = script?.getAttribute('data-vapi-public-key') || "1ef5359f-d9d0-4079-bcde-32be1631c5ba";
    const assetBaseUrl = script?.getAttribute('data-asset-base-url') || defaultBaseUrl;

    // If assetBaseUrl is determined, prepend it. Otherwise undefined (falls back to widget prop defaults or relative).
    const videoUrl = assetBaseUrl ? `${assetBaseUrl}/Kate-welcome.mp4` : undefined;
    const logoUrl = assetBaseUrl ? `${assetBaseUrl}/conquer-logo.png` : undefined;

    if (!agentId) {
        console.warn("Conquer AI Widget: No data-agent-id provided. Widget may not function correctly.");
    }

    // Create Root Element
    const rootEl = document.createElement('div');
    rootEl.id = WIDGET_ID;
    document.body.appendChild(rootEl);

    // Render Widget
    // We use createRoot for React 18
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <KateChatWidget
                vapiPublicKey={vapiPublicKey}
                agentId={agentId || defaultAgentId}
                companyName={companyName}
                videoUrl={videoUrl}
                logoUrl={logoUrl}
            />
        </React.StrictMode>
    );
}

// Initialize when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
