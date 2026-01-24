/**
 * Training Plan Manager - Express Server with Embedded CORS Proxy
 * Version: 2.0.4
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
        version: '2.0.4',
        timestamp: new Date().toISOString()
    });
});

// CORS Proxy Endpoint
// Proxies requests to external AI APIs with proper CORS handling from server side
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
            let errorMessage = `API returned ${response.status}`;
            let errorDetails = '';
            let userGuidance = '';

            // Try to parse error response
            try {
                const errorData = await response.json();
                console.error(`[PROXY ERROR] ${response.status}:`, errorData);

                // Extract error message based on provider format
                if (errorData.error) {
                    if (typeof errorData.error === 'string') {
                        errorDetails = errorData.error;
                    } else if (errorData.error.message) {
                        errorDetails = errorData.error.message;
                    } else if (errorData.error.type) {
                        errorDetails = errorData.error.type;
                    }
                }
            } catch (e) {
                // If JSON parsing fails, get text
                const errorText = await response.text();
                console.error(`[PROXY ERROR] ${response.status}: ${errorText}`);
                errorDetails = errorText;
            }

            // Provide user-friendly guidance based on status code
            if (response.status === 429) {
                errorMessage = 'Rate limit exceeded';
                userGuidance = 'You have made too many requests. Please wait a few minutes and try again.';
            } else if (response.status === 529) {
                errorMessage = 'AI service temporarily overloaded';
                userGuidance = 'The AI provider is experiencing high demand. Please wait 30-60 seconds and try again.';
            } else if (response.status === 503) {
                errorMessage = 'AI service temporarily unavailable';
                userGuidance = 'The AI provider is currently unavailable. Please try again in a few minutes.';
            } else if (response.status === 401) {
                errorMessage = 'Invalid API key';
                userGuidance = 'Please check your API key in Settings and ensure it is correct and active.';
            } else if (response.status === 400) {
                errorMessage = 'Bad request to AI service';
                userGuidance = 'The request format was invalid. This may be a configuration issue.';
            } else if (response.status === 500 || response.status === 502) {
                errorMessage = 'AI service internal error';
                userGuidance = 'The AI provider encountered an internal error. Please try again in a few minutes.';
            }

            // Return structured error response
            return res.status(response.status).json({
                error: errorMessage,
                message: userGuidance || errorDetails || 'An error occurred with the AI service',
                details: errorDetails,
                statusCode: response.status
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
