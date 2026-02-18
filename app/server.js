/**
 * Training Plan Manager - Express Server with SSO & CORS Proxy
 * Version: 2.1.0-dev
 *
 * This server provides:
 * 1. Static file serving for the Training Plan Manager HTML application
 * 2. CORS proxy endpoint for AI API calls (Anthropic, OpenAI, Google)
 * 3. Optional SSO authentication (OIDC or SAML 2.0) with server-side API key injection
 *
 * SSO Mode (when SSO_ENABLED=true):
 *   - Users authenticate via corporate IdP before accessing the app
 *   - AI API keys are held server-side (env vars), never exposed to browser
 *   - Supports: Azure AD, Okta, Google Workspace, Ping Identity, OneLogin,
 *     Keycloak, Auth0, AWS SSO, or any OIDC/SAML 2.0 compliant provider
 *
 * Standalone Mode (default, when SSO_ENABLED is not set):
 *   - No authentication required
 *   - Users provide their own API keys in the browser (existing behavior)
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Configuration from environment variables
// ============================================================
const SSO_ENABLED = process.env.SSO_ENABLED === 'true';
const SSO_PROTOCOL = (process.env.SSO_PROTOCOL || 'oidc').toLowerCase(); // 'oidc' or 'saml'

// OIDC settings
const OIDC_ISSUER = process.env.OIDC_ISSUER || '';
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID || '';
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET || '';
const OIDC_CALLBACK_URL = process.env.OIDC_CALLBACK_URL || `http://localhost:${PORT}/auth/callback`;

// SAML settings
const SAML_ENTRY_POINT = process.env.SAML_ENTRY_POINT || '';
const SAML_ISSUER = process.env.SAML_ISSUER || 'training-plan-manager';
const SAML_CERT = process.env.SAML_CERT || '';
const SAML_CALLBACK_URL = process.env.SAML_CALLBACK_URL || `http://localhost:${PORT}/auth/callback`;

// Server-side AI API keys (used when SSO is enabled)
const SERVER_ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const SERVER_OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const SERVER_GOOGLE_KEY = process.env.GOOGLE_API_KEY || '';

// Session secret
const SESSION_SECRET = process.env.SESSION_SECRET || 'training-plan-manager-dev-secret-change-me';

// ============================================================
// Middleware
// ============================================================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// Session middleware (always enabled for SSO, lightweight otherwise)
if (SSO_ENABLED) {
    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === 'true',
            httpOnly: true,
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }
    }));

    // Handle reverse proxy (for HTTPS termination at load balancer)
    if (process.env.TRUST_PROXY === 'true') {
        app.set('trust proxy', 1);
    }

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport serialize/deserialize
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // Configure the appropriate strategy
    if (SSO_PROTOCOL === 'saml') {
        configureSAML();
    } else {
        configureOIDC();
    }
}

// ============================================================
// SSO Strategy Configuration
// ============================================================
function configureOIDC() {
    const OpenIDConnectStrategy = require('passport-openidconnect');

    passport.use('oidc', new OpenIDConnectStrategy({
        issuer: OIDC_ISSUER,
        clientID: OIDC_CLIENT_ID,
        clientSecret: OIDC_CLIENT_SECRET,
        callbackURL: OIDC_CALLBACK_URL,
        scope: ['openid', 'profile', 'email']
    }, (issuer, profile, done) => {
        // Extract user info from OIDC profile
        const user = {
            id: profile.id,
            displayName: profile.displayName || profile.username || 'User',
            email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
            provider: 'oidc',
            issuer: issuer
        };
        return done(null, user);
    }));

    console.log('[SSO] OIDC strategy configured');
    console.log(`[SSO] Issuer: ${OIDC_ISSUER}`);
    console.log(`[SSO] Callback: ${OIDC_CALLBACK_URL}`);
}

function configureSAML() {
    const { Strategy: SamlStrategy } = require('@node-saml/passport-saml');

    passport.use('saml', new SamlStrategy({
        entryPoint: SAML_ENTRY_POINT,
        issuer: SAML_ISSUER,
        cert: SAML_CERT,
        callbackUrl: SAML_CALLBACK_URL,
        wantAssertionsSigned: true,
        wantAuthnResponseSigned: false
    }, (profile, done) => {
        // Extract user info from SAML assertion
        const user = {
            id: profile.nameID || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
            displayName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
                ? `${profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']} ${profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || ''}`
                : profile.nameID || 'User',
            email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || profile.nameID || '',
            provider: 'saml'
        };
        return done(null, user);
    }, (profile, done) => {
        // Logout callback
        return done(null, profile);
    }));

    console.log('[SSO] SAML strategy configured');
    console.log(`[SSO] Entry Point: ${SAML_ENTRY_POINT}`);
    console.log(`[SSO] Callback: ${SAML_CALLBACK_URL}`);
}

// ============================================================
// Auth middleware
// ============================================================
function requireAuth(req, res, next) {
    if (!SSO_ENABLED) return next();
    if (req.isAuthenticated()) return next();

    // For API calls, return 401
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required', ssoEnabled: true });
    }

    // For page requests, redirect to login
    res.redirect('/auth/login');
}

// ============================================================
// Auth routes (only active when SSO is enabled)
// ============================================================
if (SSO_ENABLED) {
    const strategyName = SSO_PROTOCOL === 'saml' ? 'saml' : 'oidc';

    // Login route
    app.get('/auth/login', passport.authenticate(strategyName, {
        ...(SSO_PROTOCOL === 'oidc' ? { scope: ['openid', 'profile', 'email'] } : {})
    }));

    // Callback route (handles both GET and POST for SAML compatibility)
    const authCallback = [
        passport.authenticate(strategyName, { failureRedirect: '/auth/login-failed' }),
        (req, res) => {
            console.log(`[SSO] User authenticated: ${req.user.displayName} (${req.user.email})`);
            res.redirect('/');
        }
    ];
    app.get('/auth/callback', ...authCallback);
    app.post('/auth/callback', ...authCallback);

    // Login failed
    app.get('/auth/login-failed', (req, res) => {
        res.status(401).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Login Failed</title></head>
            <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5;">
                <div style="text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #d32f2f;">Authentication Failed</h2>
                    <p>Unable to verify your identity. Please try again or contact your administrator.</p>
                    <a href="/auth/login" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px;">Try Again</a>
                </div>
            </body>
            </html>
        `);
    });

    // Logout route
    app.get('/auth/logout', (req, res) => {
        const userName = req.user ? req.user.displayName : 'Unknown';
        req.logout((err) => {
            if (err) console.error('[SSO] Logout error:', err);
            req.session.destroy(() => {
                console.log(`[SSO] User logged out: ${userName}`);
                res.redirect('/auth/logged-out');
            });
        });
    });

    // Logged out page
    app.get('/auth/logged-out', (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Logged Out</title></head>
            <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5;">
                <div style="text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2>Signed Out</h2>
                    <p>You have been successfully signed out.</p>
                    <a href="/auth/login" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px;">Sign In Again</a>
                </div>
            </body>
            </html>
        `);
    });

    // SAML metadata endpoint (useful for IdP configuration)
    if (SSO_PROTOCOL === 'saml') {
        app.get('/auth/metadata', (req, res) => {
            const strategy = passport._strategy('saml');
            if (strategy && strategy.generateServiceProviderMetadata) {
                res.type('application/xml');
                res.send(strategy.generateServiceProviderMetadata());
            } else {
                res.status(404).json({ error: 'SAML metadata not available' });
            }
        });
    }
}

// ============================================================
// Health check endpoint (always public)
// ============================================================
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'training-plan-manager',
        version: '2.1.0-dev',
        ssoEnabled: SSO_ENABLED,
        ssoProtocol: SSO_ENABLED ? SSO_PROTOCOL : null,
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// App config endpoint (tells frontend about auth state)
// ============================================================
app.get('/api/config', (req, res) => {
    const config = {
        ssoEnabled: SSO_ENABLED,
        ssoProtocol: SSO_ENABLED ? SSO_PROTOCOL : null,
        // When SSO is enabled, tell the frontend which providers have server-side keys
        serverManagedKeys: SSO_ENABLED ? {
            anthropic: !!SERVER_ANTHROPIC_KEY,
            openai: !!SERVER_OPENAI_KEY,
            google: !!SERVER_GOOGLE_KEY
        } : null,
        user: SSO_ENABLED && req.isAuthenticated() ? {
            displayName: req.user.displayName,
            email: req.user.email
        } : null,
        authenticated: SSO_ENABLED ? (req.isAuthenticated() || false) : null
    };
    res.json(config);
});

// ============================================================
// Protected routes (require auth when SSO is enabled)
// ============================================================

// Static files - protected when SSO enabled
if (SSO_ENABLED) {
    app.use('/public', requireAuth, express.static('public'));
} else {
    app.use(express.static('public'));
}

// CORS Proxy Endpoint
app.post('/api/proxy', requireAuth, async (req, res) => {
    const { url, method, headers, body } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing required field: url' });
    }

    console.log(`[PROXY] ${method || 'POST'} ${url}${SSO_ENABLED && req.user ? ` (user: ${req.user.email})` : ''}`);

    // Build the outgoing headers
    let outHeaders = { ...(headers || {}) };

    // Server-side API key injection when SSO is enabled
    if (SSO_ENABLED) {
        if (url.includes('anthropic.com') && SERVER_ANTHROPIC_KEY) {
            outHeaders['x-api-key'] = SERVER_ANTHROPIC_KEY;
            outHeaders['anthropic-version'] = outHeaders['anthropic-version'] || '2023-06-01';
        } else if (url.includes('openai.com') && SERVER_OPENAI_KEY) {
            outHeaders['Authorization'] = `Bearer ${SERVER_OPENAI_KEY}`;
        } else if (url.includes('googleapis.com') && SERVER_GOOGLE_KEY) {
            // Google uses URL param for key - modify the URL
            const separator = url.includes('?') ? '&' : '?';
            // We'll handle this below when making the fetch
        }
    }

    try {
        // Build the final URL (handle Google API key as URL parameter)
        let fetchUrl = url;
        if (SSO_ENABLED && url.includes('googleapis.com') && SERVER_GOOGLE_KEY) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('key', SERVER_GOOGLE_KEY);
            fetchUrl = urlObj.toString();
        }

        const response = await fetch(fetchUrl, {
            method: method || 'POST',
            headers: outHeaders,
            body: body ? JSON.stringify(body) : undefined,
            timeout: 60000
        });

        if (!response.ok) {
            let errorMessage = `API returned ${response.status}`;
            let errorDetails = '';
            let userGuidance = '';

            try {
                const errorData = await response.json();
                console.error(`[PROXY ERROR] ${response.status}:`, errorData);

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
                const errorText = await response.text();
                console.error(`[PROXY ERROR] ${response.status}: ${errorText}`);
                errorDetails = errorText;
            }

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
                userGuidance = SSO_ENABLED
                    ? 'The server-side API key is invalid or expired. Please contact your administrator.'
                    : 'Please check your API key in Settings and ensure it is correct and active.';
            } else if (response.status === 400) {
                errorMessage = 'Bad request to AI service';
                userGuidance = 'The request format was invalid. This may be a configuration issue.';
            } else if (response.status === 500 || response.status === 502) {
                errorMessage = 'AI service internal error';
                userGuidance = 'The AI provider encountered an internal error. Please try again in a few minutes.';
            }

            return res.status(response.status).json({
                error: errorMessage,
                message: userGuidance || errorDetails || 'An error occurred with the AI service',
                details: errorDetails,
                statusCode: response.status
            });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(`[PROXY ERROR] ${error.message}`);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Request timeout',
                message: 'The API request took too long to respond (>60s)'
            });
        }

        if (error.message.includes('fetch')) {
            return res.status(502).json({
                error: 'Network error',
                message: 'Could not reach the API endpoint',
                details: error.message
            });
        }

        res.status(500).json({
            error: 'Proxy error',
            message: error.message
        });
    }
});

// Root route - serve the main application (protected when SSO enabled)
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'training-plan-manager.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// ============================================================
// Start the server
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('Training Plan Manager - Web Service');
    console.log('='.repeat(60));
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check:      http://localhost:${PORT}/health`);
    console.log(`Application:       http://localhost:${PORT}`);
    console.log('-'.repeat(60));
    if (SSO_ENABLED) {
        console.log(`SSO:               ENABLED (${SSO_PROTOCOL.toUpperCase()})`);
        console.log(`Login:             http://localhost:${PORT}/auth/login`);
        console.log(`Callback:          ${SSO_PROTOCOL === 'saml' ? SAML_CALLBACK_URL : OIDC_CALLBACK_URL}`);
        if (SSO_PROTOCOL === 'saml') {
            console.log(`SAML Metadata:     http://localhost:${PORT}/auth/metadata`);
        }
        console.log('-'.repeat(60));
        console.log('Server-side API keys:');
        console.log(`  Anthropic:       ${SERVER_ANTHROPIC_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  OpenAI:          ${SERVER_OPENAI_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  Google:          ${SERVER_GOOGLE_KEY ? 'configured' : 'NOT SET'}`);
    } else {
        console.log('SSO:               DISABLED (standalone mode)');
        console.log('                   Users provide their own API keys');
    }
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
