#!/usr/bin/env node
/**
 * Training Plan Manager — Interactive Setup Script
 *
 * Inspired by ServiceNow MCP Server's setup-oauth pattern:
 * - Browser-based SSO authentication (Playwright)
 * - AES-256-GCM encrypted credential storage
 * - No OAuth app registration required
 * - Fallback to manual flow without Playwright
 *
 * Usage:
 *   node scripts/setup.js              # Interactive setup
 *   node scripts/setup.js --reconfigure  # Re-run setup
 */

const readline = require('readline');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { saveCredentials, loadCredentials } = require('./lib/credential-store');
const { authenticate } = require('./lib/browser-auth');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const CRED_FILE = path.join(DATA_DIR, 'credentials.enc');

// ============================================================
// CLI Helpers
// ============================================================
function createRL() {
    return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

async function askChoice(rl, prompt, options) {
    console.log(`\n  ${prompt}`);
    options.forEach((opt, i) => {
        const suffix = opt.tag ? `  ${opt.tag}` : '';
        console.log(`    ${i + 1}. ${opt.label}${suffix}`);
    });
    while (true) {
        const answer = await ask(rl, `\n  > `);
        const num = parseInt(answer.trim(), 10);
        if (num >= 1 && num <= options.length) return options[num - 1].value;
        console.log(`    Please enter a number between 1 and ${options.length}.`);
    }
}

async function askSecret(rl, prompt) {
    // For secrets, we can't hide input in basic readline, but we indicate it's sensitive
    return ask(rl, prompt);
}

// ============================================================
// Main Setup Flow
// ============================================================
async function main() {
    const rl = createRL();

    console.log('');
    console.log('  Training Plan Manager - Setup');
    console.log('  =============================');
    console.log('');

    // Check for existing configuration
    const isReconfigure = process.argv.includes('--reconfigure');
    if (fs.existsSync(CRED_FILE) && !isReconfigure) {
        console.log('  Configuration already exists.');
        const action = await askChoice(rl, 'What would you like to do?', [
            { label: 'Reconfigure', value: 'reconfigure' },
            { label: 'Exit', value: 'exit' }
        ]);
        if (action === 'exit') { rl.close(); return; }
    }

    // Step 1: Authentication method
    const authMethod = await askChoice(rl, 'How should users authenticate?', [
        { label: 'Login with Browser (SSO)', value: 'sso', tag: '← recommended' },
        { label: 'Shared access code', value: 'passcode' }
    ]);

    let identity = null;
    let accessToken = null;
    let accessTokenHash = null;
    let passcodeHash = null;
    let provider = null;
    let domain = null;

    if (authMethod === 'sso') {
        // Step 2: SSO Provider
        provider = await askChoice(rl, 'SSO Provider:', [
            { label: 'Okta', value: 'okta', tag: '(Most Popular)' },
            { label: 'Microsoft (Azure AD / Entra ID)', value: 'azure' },
            { label: 'Google Workspace', value: 'google' }
        ]);

        // Step 3: Provider domain
        if (provider === 'okta') {
            domain = await ask(rl, '\n  Okta domain (e.g., your-company.okta.com): ');
            domain = domain.trim();
            if (!domain.includes('.')) domain = domain + '.okta.com';
        } else if (provider === 'azure') {
            // Azure doesn't need a custom domain for myapps login
            domain = 'azure';
        } else if (provider === 'google') {
            domain = 'google';
        }

        // Step 4: Browser authentication
        identity = await authenticate(provider, domain, rl);

        if (!identity || !identity.email) {
            console.log('\n  Authentication failed. Please try again.');
            rl.close();
            process.exit(1);
        }

        console.log(`\n  Identity verified: ${identity.email}`);

        // Generate access token
        accessToken = 'tpm_' + crypto.randomBytes(24).toString('hex');
        accessTokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');

    } else {
        // Passcode mode
        console.log('');
        const passcode = await ask(rl, '  Set a shared access code for all users: ');
        if (!passcode.trim()) {
            console.log('  Access code cannot be empty.');
            rl.close();
            process.exit(1);
        }
        // Hash the passcode using PBKDF2
        const salt = crypto.randomBytes(16);
        passcodeHash = {
            hash: crypto.pbkdf2Sync(passcode.trim(), salt, 100000, 32, 'sha512').toString('hex'),
            salt: salt.toString('hex')
        };
    }

    // Step 5: AI API Keys
    console.log('\n  AI API Keys (team members will not see these):');
    console.log('  Press Enter to skip any provider.\n');

    const anthropicKey = await askSecret(rl, '  Anthropic (Claude) key: ');
    const openaiKey = await askSecret(rl, '  OpenAI (GPT) key:       ');
    const googleKey = await askSecret(rl, '  Google (Gemini) key:    ');

    if (!anthropicKey.trim() && !openaiKey.trim() && !googleKey.trim()) {
        console.log('\n  Warning: No AI API keys provided. Users will need to enter their own keys.');
    }

    // Step 6: Build config and encrypt
    const config = {
        version: 2,
        setupComplete: true,
        mode: authMethod === 'sso' ? 'token' : 'passcode',
        createdAt: new Date().toISOString(),
        sessionSecret: crypto.randomBytes(32).toString('hex')
    };

    if (authMethod === 'sso') {
        config.ssoProvider = provider;
        config.ssoDomain = domain;
        config.accessTokenHash = accessTokenHash;
        config.verifiedUser = {
            email: identity.email,
            name: identity.name || identity.email.split('@')[0],
            provider: provider
        };
    } else {
        config.passcodeHash = passcodeHash;
    }

    config.aiKeys = {
        anthropic: anthropicKey.trim(),
        openai: openaiKey.trim(),
        google: googleKey.trim()
    };

    // Save encrypted credentials
    const { credPath, keyPath } = saveCredentials(DATA_DIR, config);

    console.log('\n  Configuration encrypted and saved.');
    console.log(`  Credentials: ${credPath}`);
    console.log(`  Key file:    ${keyPath}`);

    // Display access token
    if (accessToken) {
        console.log('');
        console.log('  +-------------------------------------------------+');
        console.log('  | Your access token (save this!):                  |');
        console.log('  |                                                  |');
        console.log(`  |   ${accessToken}  |`);
        console.log('  |                                                  |');
        console.log('  | Enter this token when you open the app.          |');
        console.log('  | Share it with authorized team members.           |');
        console.log('  +-------------------------------------------------+');
    }

    console.log('\n  Next steps:');
    console.log('    1. Start the app:  docker compose up -d --build');
    console.log('    2. Open:           http://localhost:3000');
    if (config.mode === 'passcode') {
        console.log('    3. Enter your access code when prompted.');
    } else {
        console.log('    3. Enter the access token shown above.');
    }
    console.log('');

    rl.close();
}

main().catch(err => {
    console.error('\n  Error:', err.message);
    process.exit(1);
});
