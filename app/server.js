/**
 * Training Plan Manager - Express Server with Embedded CORS Proxy
 * Version: 2.0.0
 *
 * This server provides:
 * 1. Static file serving for the Training Plan Manager HTML application
 * 2. CORS proxy endpoint for AI API calls (Anthropic, OpenAI, Google)
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with 50MB limit
app.use(express.static('public')); // Serve static files from public directory

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'training-plan-manager',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// CORS Proxy Endpoint
// Proxies requests to external AI APIs to bypass browser CORS restrictions
app.post('/api/proxy', async (req, res) => {
    const { url, method, headers, body } = req.body;

    // Validate required fields
    if (!url) {
        return res.status(400).json({
            error: 'Missing required field: url'
        });
    }

    // Log the proxied request (for debugging)
    console.log(`[PROXY] ${method || 'POST'} ${url}`);

    try {
        // Make the proxied request
        const response = await fetch(url, {
            method: method || 'POST',
            headers: headers || {},
            body: body ? JSON.stringify(body) : undefined,
            timeout: 60000 // 60 second timeout
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[PROXY ERROR] ${response.status}: ${errorText}`);
            return res.status(response.status).json({
                error: `API returned ${response.status}`,
                details: errorText
            });
        }

        // Parse and return the JSON response
        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(`[PROXY ERROR] ${error.message}`);

        // Handle timeout errors
        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'The API request took too long to respond (>60s)'
            });
        }

        // Handle network errors
        if (error.message.includes('fetch')) {
            return res.status(502).json({
                error: 'Network error',
                message: 'Could not reach the API endpoint',
                details: error.message
            });
        }

        // Generic error handler
        res.status(500).json({
            error: 'Proxy error',
            message: error.message
        });
    }
});

// Root route - serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'training-plan-manager.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('Training Plan Manager - Web Service');
    console.log('='.repeat(60));
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check:      http://localhost:${PORT}/health`);
    console.log(`Application:       http://localhost:${PORT}`);
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
