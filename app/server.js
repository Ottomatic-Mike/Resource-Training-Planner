/**
 * Training Plan Manager - Express Server with SSO & CORS Proxy
 * Version: 2.1.0-dev
 *
 * This server provides:
 * 1. Static file serving for the Training Plan Manager HTML application
 * 2. CORS proxy endpoint for AI API calls (Anthropic, OpenAI, Google)
 * 3. Optional SSO authentication (OIDC or SAML 2.0) with server-side API key injection
 *
 * Security hardened per audit — see CHANGELOG.md for details.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ============================================================
// Config file support (browser-based setup wizard + CLI setup script)
// ============================================================
const CONFIG_DIR = path.join(__dirname, 'data');
const CONFIG_FILE = path.join(CONFIG_DIR, 'setup.json');
const CRED_FILE = path.join(CONFIG_DIR, 'credentials.enc');
const CRED_KEY_FILE = path.join(CONFIG_DIR, 'credentials.key');

// Load setup.json (web-based setup wizard config)
function loadSetupConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            if (data && data.setupComplete) return data;
        }
    } catch (e) {
        console.warn('[CONFIG] Could not load setup.json:', e.message);
    }
    return null;
}

// Load encrypted credentials (CLI setup script config)
function loadEncryptedCredentials() {
    try {
        if (fs.existsSync(CRED_FILE) && fs.existsSync(CRED_KEY_FILE)) {
            const passphrase = fs.readFileSync(CRED_KEY_FILE, 'utf8').trim();
            const blob = JSON.parse(fs.readFileSync(CRED_FILE, 'utf8'));

            // Decrypt using AES-256-GCM
            const salt = Buffer.from(blob.salt, 'base64');
            const iv = Buffer.from(blob.iv, 'base64');
            const authTag = Buffer.from(blob.authTag, 'base64');
            const ciphertext = Buffer.from(blob.ciphertext, 'base64');
            const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');

            const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(authTag);
            const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
            const data = JSON.parse(decrypted.toString('utf8'));

            if (data && data.setupComplete) return data;
        }
    } catch (e) {
        console.warn('[CONFIG] Could not load encrypted credentials:', e.message);
    }
    return null;
}

const setupConfig = loadSetupConfig();
const encryptedConfig = loadEncryptedCredentials();

// Token/passcode auth from CLI setup script
let TOKEN_AUTH_CONFIG = null;
if (encryptedConfig && (encryptedConfig.mode === 'token' || encryptedConfig.mode === 'passcode')) {
    TOKEN_AUTH_CONFIG = encryptedConfig;
    // Apply session secret
    if (encryptedConfig.sessionSecret && !process.env.SESSION_SECRET) {
        process.env.SESSION_SECRET = encryptedConfig.sessionSecret;
    }
    // Apply AI keys
    if (encryptedConfig.aiKeys) {
        if (encryptedConfig.aiKeys.anthropic && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = encryptedConfig.aiKeys.anthropic;
        if (encryptedConfig.aiKeys.openai && !process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = encryptedConfig.aiKeys.openai;
        if (encryptedConfig.aiKeys.google && !process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = encryptedConfig.aiKeys.google;
    }
    console.log(`[CONFIG] Loaded encrypted credentials (mode: ${encryptedConfig.mode})`);
}

// Apply setup.json config to env (OIDC setup wizard mode)
if (setupConfig) {
    if (setupConfig.mode === 'sso' && setupConfig.sso) {
        if (!process.env.SSO_ENABLED) process.env.SSO_ENABLED = 'true';
        if (!process.env.SSO_PROTOCOL) process.env.SSO_PROTOCOL = setupConfig.sso.protocol || 'oidc';
        if (!process.env.OIDC_ISSUER && setupConfig.sso.issuer) process.env.OIDC_ISSUER = setupConfig.sso.issuer;
        if (!process.env.OIDC_CLIENT_ID && setupConfig.sso.clientId) process.env.OIDC_CLIENT_ID = setupConfig.sso.clientId;
        if (!process.env.OIDC_CLIENT_SECRET && setupConfig.sso.clientSecret) process.env.OIDC_CLIENT_SECRET = setupConfig.sso.clientSecret;
        if (!process.env.OIDC_CALLBACK_URL && setupConfig.sso.callbackUrl) process.env.OIDC_CALLBACK_URL = setupConfig.sso.callbackUrl;
    }
    if (setupConfig.sessionSecret && !process.env.SESSION_SECRET) {
        process.env.SESSION_SECRET = setupConfig.sessionSecret;
    }
    if (setupConfig.aiKeys) {
        if (setupConfig.aiKeys.anthropic && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = setupConfig.aiKeys.anthropic;
        if (setupConfig.aiKeys.openai && !process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = setupConfig.aiKeys.openai;
        if (setupConfig.aiKeys.google && !process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = setupConfig.aiKeys.google;
    }
    console.log(`[CONFIG] Loaded setup.json (mode: ${setupConfig.mode})`);
}

// Determine active auth mode
const TOKEN_AUTH_ENABLED = !!TOKEN_AUTH_CONFIG;
const SETUP_AVAILABLE = !setupConfig && !encryptedConfig && process.env.SSO_ENABLED !== 'true';

// ============================================================
// Configuration from environment variables
// ============================================================
const SSO_ENABLED = process.env.SSO_ENABLED === 'true';
const SSO_PROTOCOL = (process.env.SSO_PROTOCOL || 'oidc').toLowerCase();

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

// Session secret — [C2] fail-safe: require in SSO production, generate random in dev
let SESSION_SECRET;
if (process.env.SESSION_SECRET) {
    SESSION_SECRET = process.env.SESSION_SECRET;
} else if (SSO_ENABLED && IS_PRODUCTION) {
    console.error('FATAL: SESSION_SECRET environment variable is required when SSO is enabled in production.');
    console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    process.exit(1);
} else {
    SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    if (SSO_ENABLED) {
        console.warn('[SECURITY] SESSION_SECRET not set — using random ephemeral secret (sessions lost on restart)');
    }
}

// [M1] Validate required SSO environment variables on startup
if (SSO_ENABLED) {
    const missing = [];
    const requiredAlways = ['SESSION_SECRET'];
    const requiredOidc = ['OIDC_ISSUER', 'OIDC_CLIENT_ID', 'OIDC_CLIENT_SECRET'];
    const requiredSaml = ['SAML_ENTRY_POINT', 'SAML_CERT'];

    for (const v of requiredAlways) {
        if (!process.env[v]) missing.push(v);
    }
    const protocolVars = SSO_PROTOCOL === 'saml' ? requiredSaml : requiredOidc;
    for (const v of protocolVars) {
        if (!process.env[v]) missing.push(v);
    }
    if (missing.length > 0 && IS_PRODUCTION) {
        console.error('FATAL: Missing required SSO environment variables:');
        missing.forEach(v => console.error(`  - ${v}`));
        process.exit(1);
    } else if (missing.length > 0) {
        console.warn('[SSO] Missing environment variables (will fail at runtime):');
        missing.forEach(v => console.warn(`  - ${v}`));
    }
}

// ============================================================
// [C1] SSRF Protection — URL allowlist for /api/proxy
// ============================================================
const ALLOWED_PROXY_HOSTS = [
    'api.anthropic.com',
    'api.openai.com',
    'generativelanguage.googleapis.com'
];

const BLOCKED_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^0\.0\.0\.0$/,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
    /^localhost$/i
];

function isAllowedProxyUrl(urlString) {
    try {
        const urlObj = new URL(urlString);

        // Only HTTPS allowed
        if (urlObj.protocol !== 'https:') return false;

        const hostname = urlObj.hostname;

        // Block private/reserved IPs
        for (const pattern of BLOCKED_IP_PATTERNS) {
            if (pattern.test(hostname)) return false;
        }

        // Allowlist check
        return ALLOWED_PROXY_HOSTS.some(allowed =>
            hostname === allowed || hostname.endsWith('.' + allowed)
        );
    } catch (e) {
        return false;
    }
}

// ============================================================
// [H3] Input validation for proxy requests
// ============================================================
const ALLOWED_PROXY_METHODS = ['POST', 'GET'];
const BLOCKED_HEADERS = ['cookie', 'host', 'content-length', 'transfer-encoding'];

function validateProxyHeaders(headers) {
    if (!headers || typeof headers !== 'object') return {};
    const safe = {};
    for (const [key, value] of Object.entries(headers)) {
        if (typeof key !== 'string' || typeof value !== 'string') continue;
        // Block dangerous headers
        if (BLOCKED_HEADERS.includes(key.toLowerCase())) continue;
        // Block CRLF injection
        if (/[\r\n]/.test(key) || /[\r\n]/.test(value)) continue;
        safe[key] = value;
    }
    return safe;
}

function validateProxyBody(body) {
    if (!body || typeof body !== 'object') return body;
    // Block prototype pollution keys
    if ('__proto__' in body || 'constructor' in body || 'prototype' in body) {
        const cleaned = JSON.parse(JSON.stringify(body));
        delete cleaned.__proto__;
        delete cleaned.constructor;
        delete cleaned.prototype;
        return cleaned;
    }
    return body;
}

// ============================================================
// [L2] Security event logging
// ============================================================
function securityLog(event, details) {
    const entry = {
        timestamp: new Date().toISOString(),
        event,
        ...details
    };
    console.log(`[SECURITY] ${JSON.stringify(entry)}`);
}

// ============================================================
// Middleware
// ============================================================

// [H2] Security headers via helmet
// Note: CSP uses 'unsafe-inline' because the SPA has a large inline <script> block
// and inline onclick handlers. A future refactor to external JS would allow removing this.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: null
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
    hsts: IS_PRODUCTION ? { maxAge: 31536000, includeSubDomains: true } : false
}));

// [H1] CORS — restrict when SSO enabled
if (SSO_ENABLED) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;
    app.use(cors({
        origin: function(origin, callback) {
            // Allow same-origin (no origin header) and configured origin
            if (!origin || origin === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }));
} else {
    app.use(cors());
}

// [M8] Reduced JSON body limit (10MB instead of 50MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// [H5] Rate limiting
const proxyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Rate limit exceeded', message: 'Too many requests. Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// ============================================================
// Session & Passport (SSO or Token auth mode)
// ============================================================
if (SSO_ENABLED || TOKEN_AUTH_ENABLED) {
    // Handle reverse proxy BEFORE session middleware
    if (process.env.TRUST_PROXY === 'true') {
        app.set('trust proxy', 1);
    } else if (IS_PRODUCTION && SSO_ENABLED) {
        console.warn('[SECURITY] TRUST_PROXY not set in production. Set to "true" if behind a reverse proxy.');
    }

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        name: 'tpm.sid',
        cookie: {
            secure: IS_PRODUCTION && !TOKEN_AUTH_ENABLED, // Token auth often runs locally
            httpOnly: true,
            sameSite: 'lax',                      // [H1] CSRF protection (lax for OIDC redirect compat)
            maxAge: 4 * 60 * 60 * 1000            // 4 hours (reduced from 8)
        }
    }));

    if (SSO_ENABLED) {
        app.use(passport.initialize());
        app.use(passport.session());

        // [M7] Passport serialize — whitelist safe attributes only
        const SAFE_USER_ATTRS = ['id', 'displayName', 'email', 'provider', 'issuer'];

        passport.serializeUser((user, done) => {
            const safe = {};
            for (const attr of SAFE_USER_ATTRS) {
                if (attr in user && typeof user[attr] === 'string') {
                    safe[attr] = user[attr].slice(0, 255);
                }
            }
            done(null, safe);
        });

        passport.deserializeUser((user, done) => {
            if (!user || !user.id) return done(new Error('Invalid session user'));
            done(null, user);
        });

        if (SSO_PROTOCOL === 'saml') {
            configureSAML();
        } else {
            // OIDC configuration is async (requires endpoint discovery)
            configureOIDC().catch(err => {
                console.error('[SSO] OIDC configuration failed:', err.message);
                console.error('[SSO] SSO login will not work. Fix the OIDC issuer and restart.');
            });
        }
    }
}

// ============================================================
// SSO Strategy Configuration
// ============================================================
async function configureOIDC() {
    const OpenIDConnectStrategy = require('passport-openidconnect');

    // passport-openidconnect@0.1.x requires explicit endpoint URLs.
    // Perform OIDC discovery to resolve them from the issuer.
    const discoveryUrl = OIDC_ISSUER.replace(/\/$/, '') + '/.well-known/openid-configuration';
    console.log(`[SSO] Discovering OIDC endpoints from ${discoveryUrl}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let oidcConfig;
    try {
        const response = await fetch(discoveryUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) {
            throw new Error(`Discovery returned HTTP ${response.status}`);
        }
        oidcConfig = await response.json();
    } catch (e) {
        clearTimeout(timeout);
        console.error(`[SSO] OIDC discovery failed for ${OIDC_ISSUER}: ${e.message}`);
        console.error('[SSO] Server will start, but SSO login will not work until the issuer is accessible.');
        console.error('[SSO] To reconfigure, delete data/setup.json and restart.');
        return; // Don't crash — server starts without SSO strategy
    }

    if (!oidcConfig.authorization_endpoint || !oidcConfig.token_endpoint) {
        console.error('[SSO] OIDC discovery document missing required endpoints (authorization_endpoint, token_endpoint).');
        return;
    }

    passport.use('oidc', new OpenIDConnectStrategy({
        issuer: OIDC_ISSUER,
        authorizationURL: oidcConfig.authorization_endpoint,
        tokenURL: oidcConfig.token_endpoint,
        userInfoURL: oidcConfig.userinfo_endpoint,
        clientID: OIDC_CLIENT_ID,
        clientSecret: OIDC_CLIENT_SECRET,
        callbackURL: OIDC_CALLBACK_URL,
        scope: ['openid', 'profile', 'email']
    }, (issuer, profile, done) => {
        const user = {
            id: String(profile.id || '').slice(0, 255),
            displayName: String(profile.displayName || profile.username || 'User').slice(0, 255),
            email: String((profile.emails && profile.emails[0] && profile.emails[0].value) || '').slice(0, 255),
            provider: 'oidc',
            issuer: String(issuer || '').slice(0, 500)
        };
        return done(null, user);
    }));

    console.log('[SSO] OIDC strategy configured successfully');
    console.log(`[SSO] Issuer: ${OIDC_ISSUER}`);
    console.log(`[SSO] Authorization: ${oidcConfig.authorization_endpoint}`);
}

function configureSAML() {
    const { Strategy: SamlStrategy } = require('@node-saml/passport-saml');

    passport.use('saml', new SamlStrategy({
        entryPoint: SAML_ENTRY_POINT,
        issuer: SAML_ISSUER,
        cert: SAML_CERT,
        callbackUrl: SAML_CALLBACK_URL,
        wantAssertionsSigned: true,
        wantAuthnResponseSigned: true,        // [H7] require signed responses
        validateInResponseTo: 'always',       // [M11] prevent replay attacks
        acceptedClockSkewMs: 5000
    }, (profile, done) => {
        const user = {
            id: String(profile.nameID || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '').slice(0, 255),
            displayName: (profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
                ? `${profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']} ${profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || ''}`
                : String(profile.nameID || 'User')
            ).slice(0, 255),
            email: String(profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || profile.nameID || '').slice(0, 255),
            provider: 'saml'
        };
        return done(null, user);
    }, (profile, done) => {
        return done(null, profile);
    }));

    console.log('[SSO] SAML strategy configured');
    console.log(`[SSO] Entry Point: ${SAML_ENTRY_POINT}`);
}

// ============================================================
// Auth middleware
// ============================================================
function requireAuth(req, res, next) {
    // Token/passcode auth mode (from CLI setup script)
    if (TOKEN_AUTH_ENABLED) {
        if (req.session && req.session.tokenAuthenticated) return next();

        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Authentication required', authMode: TOKEN_AUTH_CONFIG.mode });
        }
        return res.redirect('/login');
    }

    // OIDC/SAML SSO mode
    if (!SSO_ENABLED) return next();

    // Check for invalidated session
    if (req.session && req.session.invalidated) {
        return res.status(401).json({ error: 'Session expired', ssoEnabled: true });
    }

    if (req.isAuthenticated()) return next();

    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required', ssoEnabled: true });
    }

    res.redirect('/auth/login');
}

// ============================================================
// Auth routes (only active when SSO is enabled)
// ============================================================
if (SSO_ENABLED) {
    const strategyName = SSO_PROTOCOL === 'saml' ? 'saml' : 'oidc';

    // [H5] Rate limit login attempts
    app.get('/auth/login', authLimiter, passport.authenticate(strategyName, {
        ...(SSO_PROTOCOL === 'oidc' ? { scope: ['openid', 'profile', 'email'] } : {})
    }));

    // [H4] Callback with session regeneration to prevent session fixation
    const authCallback = [
        passport.authenticate(strategyName, { failureRedirect: '/auth/login-failed' }),
        (req, res) => {
            // [L1] Log user ID only, not email
            securityLog('AUTH_SUCCESS', { userId: req.user.id, provider: req.user.provider });

            // [H4] Regenerate session to prevent fixation
            const user = req.user;
            req.session.regenerate((err) => {
                if (err) {
                    console.error('[SSO] Session regeneration error:', err);
                    return res.redirect('/auth/login-failed');
                }
                // Re-attach user to new session
                req.login(user, (loginErr) => {
                    if (loginErr) {
                        console.error('[SSO] Re-login after regeneration error:', loginErr);
                        return res.redirect('/auth/login-failed');
                    }
                    req.session.authenticatedAt = Date.now();
                    res.redirect('/');
                });
            });
        }
    ];
    app.get('/auth/callback', ...authCallback);
    app.post('/auth/callback', ...authCallback);

    // Login failed
    app.get('/auth/login-failed', (req, res) => {
        securityLog('AUTH_FAILURE', { ip: req.ip });
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

    // [M9 partial] Logout with proper session cleanup and cookie clearing
    app.get('/auth/logout', (req, res) => {
        const userId = req.user ? req.user.id : 'unknown';

        // Mark session as invalidated immediately
        if (req.session) {
            req.session.invalidated = true;
        }

        req.logout((err) => {
            if (err) console.error('[SSO] Logout error:', err);
            req.session.destroy((destroyErr) => {
                if (destroyErr) console.error('[SSO] Session destroy error:', destroyErr);

                // Clear session cookie
                res.clearCookie('tpm.sid', { path: '/', httpOnly: true });

                securityLog('LOGOUT', { userId });
                res.redirect('/auth/logged-out');
            });
        });
    });

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

    // SAML metadata endpoint
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
// [M4] Health check — minimal info on public endpoint
// ============================================================
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// Browser-Based Setup Wizard (always available for initial setup or reconfiguration)
// ============================================================
// Serve setup wizard page
app.get('/setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'setup.html'));
});

// Save setup configuration and restart server
app.post('/admin/api/setup', async (req, res) => {
    const { mode, passcode, aiKeys } = req.body;

    // Validate input
    if (!mode || mode !== 'passcode') {
        return res.status(400).json({ error: 'Invalid mode.' });
    }

    if (!passcode || typeof passcode !== 'string' || passcode.trim().length < 1) {
        return res.status(400).json({ error: 'Access code is required.' });
    }

    // Hash the passcode with PBKDF2
    const salt = crypto.randomBytes(16);
    const passcodeHash = {
        hash: crypto.pbkdf2Sync(passcode.trim(), salt, 100000, 32, 'sha512').toString('hex'),
        salt: salt.toString('hex')
    };

    // Build encrypted config (same format as CLI setup script)
    const config = {
        version: 2,
        setupComplete: true,
        mode: 'passcode',
        createdAt: new Date().toISOString(),
        sessionSecret: crypto.randomBytes(32).toString('hex'),
        passcodeHash: passcodeHash,
        aiKeys: {
            anthropic: String((aiKeys && aiKeys.anthropic) || '').slice(0, 255),
            openai: String((aiKeys && aiKeys.openai) || '').slice(0, 255),
            google: String((aiKeys && aiKeys.google) || '').slice(0, 255)
        }
    };

    // Encrypt and save using AES-256-GCM (same as credential-store.js)
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }

        const passphrase = crypto.randomBytes(32).toString('hex');
        const encSalt = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);
        const key = crypto.pbkdf2Sync(passphrase, encSalt, 100000, 32, 'sha512');

        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const plaintext = Buffer.from(JSON.stringify(config), 'utf8');
        const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        const authTag = cipher.getAuthTag();

        const blob = {
            salt: encSalt.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            ciphertext: ciphertext.toString('base64')
        };

        fs.writeFileSync(CRED_FILE, JSON.stringify(blob, null, 2));
        fs.writeFileSync(CRED_KEY_FILE, passphrase);
        console.log('[SETUP] Encrypted credentials saved via web setup');
    } catch (err) {
        console.error('[SETUP] Failed to save config:', err.message);
        return res.status(500).json({
            error: 'Failed to save configuration.',
            details: err.code === 'EROFS' ? 'Filesystem is read-only. Ensure a writable volume is mounted at /app/data.' : err.message
        });
    }

    // Send success response
    res.json({ success: true, message: 'Configuration saved. Server restarting...' });

    // Restart server after response is sent (Docker will auto-restart the container)
    setTimeout(() => {
        console.log('[SETUP] Restarting server to apply new configuration...');
        process.exit(0);
    }, 1000);
});

// ============================================================
// Token/Passcode Authentication (from CLI setup script)
// ============================================================
if (TOKEN_AUTH_ENABLED) {
    // Serve login page
    app.get('/login', (req, res) => {
        if (req.session && req.session.tokenAuthenticated) {
            return res.redirect('/');
        }
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    // Validate token/passcode and create session
    app.post('/auth/token', authLimiter, (req, res) => {
        const { token } = req.body;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Token is required.' });
        }

        let valid = false;
        let user = null;

        if (TOKEN_AUTH_CONFIG.mode === 'token') {
            // Compare SHA-256 hash of submitted token with stored hash
            const hash = crypto.createHash('sha256').update(token.trim()).digest('hex');
            valid = hash === TOKEN_AUTH_CONFIG.accessTokenHash;
            if (valid && TOKEN_AUTH_CONFIG.verifiedUser) {
                user = TOKEN_AUTH_CONFIG.verifiedUser;
            }
        } else if (TOKEN_AUTH_CONFIG.mode === 'passcode') {
            // Verify passcode via PBKDF2
            const stored = TOKEN_AUTH_CONFIG.passcodeHash;
            if (stored && stored.salt && stored.hash) {
                const salt = Buffer.from(stored.salt, 'hex');
                const hash = crypto.pbkdf2Sync(token.trim(), salt, 100000, 32, 'sha512').toString('hex');
                valid = hash === stored.hash;
            }
        }

        if (!valid) {
            securityLog('AUTH_FAILURE', { mode: TOKEN_AUTH_CONFIG.mode });
            return res.status(401).json({ error: 'Invalid access token or code.' });
        }

        // Regenerate session to prevent fixation
        req.session.regenerate((err) => {
            if (err) {
                console.error('[AUTH] Session regeneration error:', err);
                return res.status(500).json({ error: 'Session error.' });
            }
            req.session.tokenAuthenticated = true;
            req.session.authenticatedAt = Date.now();
            if (user) {
                req.session.user = {
                    email: String(user.email).slice(0, 255),
                    displayName: String(user.name || user.email).slice(0, 255),
                    provider: String(user.provider || 'token').slice(0, 50)
                };
            }
            securityLog('AUTH_SUCCESS', { mode: TOKEN_AUTH_CONFIG.mode, user: user ? user.email : 'passcode' });
            res.json({ success: true });
        });
    });

    // Logout for token auth
    app.get('/auth/logout', (req, res) => {
        req.session.destroy(() => {
            res.clearCookie('tpm.sid');
            res.redirect('/login');
        });
    });
}

// ============================================================
// [M3] App config endpoint — only expose what frontend needs
// ============================================================
app.get('/api/config', (req, res) => {
    const authActive = SSO_ENABLED || TOKEN_AUTH_ENABLED;
    const isAuthed = TOKEN_AUTH_ENABLED
        ? !!(req.session && req.session.tokenAuthenticated)
        : (SSO_ENABLED && req.isAuthenticated ? req.isAuthenticated() : false);

    const config = {
        ssoEnabled: authActive,
        authMode: TOKEN_AUTH_ENABLED ? TOKEN_AUTH_CONFIG.mode : (SSO_ENABLED ? 'oidc' : 'none'),
        setupAvailable: SETUP_AVAILABLE,
        serverManagedKeys: authActive ? {
            anthropic: !!SERVER_ANTHROPIC_KEY,
            openai: !!SERVER_OPENAI_KEY,
            google: !!SERVER_GOOGLE_KEY
        } : null,
        user: isAuthed ? (
            TOKEN_AUTH_ENABLED && req.session.user
                ? { displayName: req.session.user.displayName, email: req.session.user.email }
                : (req.user ? { displayName: req.user.displayName, email: req.user.email } : null)
        ) : null,
        authenticated: authActive ? isAuthed : null
    };
    res.json(config);
});

// ============================================================
// Protected routes
// ============================================================

// Static files
if (SSO_ENABLED || TOKEN_AUTH_ENABLED) {
    app.use('/public', requireAuth, express.static('public'));
} else {
    app.use(express.static('public'));
}

// ============================================================
// [C1, H3, H5, H6] CORS Proxy Endpoint — hardened
// ============================================================
app.post('/api/proxy', requireAuth, proxyLimiter, async (req, res) => {
    const { url, method, headers, body } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing required field: url' });
    }

    // [C1] Validate URL against allowlist
    if (!isAllowedProxyUrl(url)) {
        securityLog('PROXY_BLOCKED', {
            url: String(url).slice(0, 200),
            userId: req.user ? req.user.id : 'anonymous'
        });
        return res.status(403).json({
            error: 'Request blocked',
            message: 'The requested URL is not in the allowed list of AI provider endpoints.'
        });
    }

    // [H3] Validate method
    const safeMethod = (method || 'POST').toUpperCase();
    if (!ALLOWED_PROXY_METHODS.includes(safeMethod)) {
        return res.status(400).json({ error: 'HTTP method not allowed' });
    }

    // [H3] Sanitize headers and body
    let outHeaders = validateProxyHeaders(headers);
    const safeBody = validateProxyBody(body);

    // [L1] Log without PII
    console.log(`[PROXY] ${safeMethod} ${url}${SSO_ENABLED && req.user ? ` (uid: ${req.user.id})` : ''}`);

    // Server-side API key injection when SSO is enabled
    if (SSO_ENABLED) {
        if (url.includes('anthropic.com') && SERVER_ANTHROPIC_KEY) {
            outHeaders['x-api-key'] = SERVER_ANTHROPIC_KEY;
            outHeaders['anthropic-version'] = outHeaders['anthropic-version'] || '2023-06-01';
        } else if (url.includes('openai.com') && SERVER_OPENAI_KEY) {
            outHeaders['Authorization'] = `Bearer ${SERVER_OPENAI_KEY}`;
        }
    }

    try {
        // Build final URL (Google API key as URL param)
        let fetchUrl = url;
        if (SSO_ENABLED && url.includes('googleapis.com') && SERVER_GOOGLE_KEY) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('key', SERVER_GOOGLE_KEY);
            fetchUrl = urlObj.toString();
        }

        // [M2] Use built-in Node.js fetch (Node 18+)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(fetchUrl, {
            method: safeMethod,
            headers: outHeaders,
            body: safeBody ? JSON.stringify(safeBody) : undefined,
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            let errorMessage = `API returned ${response.status}`;
            let userGuidance = '';

            // [H6] Log full error server-side, return sanitized message to client
            try {
                const errorData = await response.json();
                console.error(`[PROXY ERROR] ${response.status}:`, JSON.stringify(errorData).slice(0, 500));
            } catch (e) {
                try {
                    const errorText = await response.text();
                    console.error(`[PROXY ERROR] ${response.status}: ${errorText.slice(0, 500)}`);
                } catch (e2) {
                    console.error(`[PROXY ERROR] ${response.status}: Could not read error body`);
                }
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
                    ? 'The server-side API key may be invalid. Please contact your administrator.'
                    : 'Please check your API key in Settings and ensure it is correct and active.';
            } else if (response.status === 400) {
                errorMessage = 'Bad request to AI service';
                userGuidance = 'The request format was invalid. This may be a configuration issue.';
            } else if (response.status === 500 || response.status === 502) {
                errorMessage = 'AI service internal error';
                userGuidance = 'The AI provider encountered an internal error. Please try again in a few minutes.';
            }

            // [H6] Never return raw upstream error details to client
            return res.status(response.status).json({
                error: errorMessage,
                message: userGuidance || 'An error occurred with the AI service.',
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
                message: 'The AI request took too long to respond (>60s).'
            });
        }

        // [H6] Generic error — no internal details leaked
        res.status(502).json({
            error: 'Service unavailable',
            message: 'Could not reach the AI provider. Please try again.'
        });
    }
});

// Root route
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'training-plan-manager.html'));
});

// 404 handler — [H6] don't echo back the path
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
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
    console.log(`Environment:       ${IS_PRODUCTION ? 'production' : 'development'}`);
    console.log('-'.repeat(60));
    if (TOKEN_AUTH_ENABLED) {
        console.log(`Auth:              ${TOKEN_AUTH_CONFIG.mode.toUpperCase()} (CLI setup script)`);
        console.log(`Login:             http://localhost:${PORT}/login`);
        if (TOKEN_AUTH_CONFIG.verifiedUser) {
            console.log(`Admin:             ${TOKEN_AUTH_CONFIG.verifiedUser.email}`);
        }
        console.log('-'.repeat(60));
        console.log('Server-side API keys:');
        console.log(`  Anthropic:       ${SERVER_ANTHROPIC_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  OpenAI:          ${SERVER_OPENAI_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  Google:          ${SERVER_GOOGLE_KEY ? 'configured' : 'NOT SET'}`);
        console.log('-'.repeat(60));
        console.log('Security:');
        console.log(`  Credentials:     AES-256-GCM encrypted`);
        console.log(`  Session secret:  configured (from encrypted config)`);
        console.log(`  Rate limiting:   30 req/min (proxy), 20 req/15min (auth)`);
    } else if (SSO_ENABLED) {
        console.log(`SSO:               ENABLED (${SSO_PROTOCOL.toUpperCase()})`);
        console.log(`Login:             http://localhost:${PORT}/auth/login`);
        if (SSO_PROTOCOL === 'saml') {
            console.log(`SAML Metadata:     http://localhost:${PORT}/auth/metadata`);
        }
        console.log('-'.repeat(60));
        console.log('Server-side API keys:');
        console.log(`  Anthropic:       ${SERVER_ANTHROPIC_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  OpenAI:          ${SERVER_OPENAI_KEY ? 'configured' : 'NOT SET'}`);
        console.log(`  Google:          ${SERVER_GOOGLE_KEY ? 'configured' : 'NOT SET'}`);
        console.log('-'.repeat(60));
        console.log('Security:');
        console.log(`  Session secret:  ${process.env.SESSION_SECRET ? 'configured' : 'EPHEMERAL (set SESSION_SECRET!)'}`);
        console.log(`  Trust proxy:     ${process.env.TRUST_PROXY === 'true' ? 'yes' : 'no'}`);
        console.log(`  Secure cookies:  ${IS_PRODUCTION ? 'yes' : 'no (dev mode)'}`);
        console.log(`  Rate limiting:   30 req/min (proxy), 20 req/15min (auth)`);
    } else {
        console.log('SSO:               DISABLED (standalone mode)');
        console.log('                   Users provide their own API keys');
        if (SETUP_AVAILABLE) {
            console.log('-'.repeat(60));
            console.log('SSO Setup Wizard:  http://localhost:' + PORT + '/setup');
            console.log('                   Configure team login via browser');
        }
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
