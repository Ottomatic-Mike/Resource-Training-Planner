/**
 * Browser-Based SSO Authentication
 * Captures user identity via Playwright browser automation.
 *
 * With Playwright: Opens Chromium, user authenticates, identity captured automatically.
 * Without Playwright: Opens default browser, user confirms login, enters email manually.
 */

const { exec } = require('child_process');

// IdP configuration: login URLs and post-login detection
const IDP_CONFIG = {
    okta: {
        loginUrl: (domain) => `https://${domain}`,
        successPatterns: ['/app/UserHome', '/app/user', '/enduser/'],
        extractIdentity: async (page) => {
            try {
                // Wait for dashboard to load
                await page.waitForTimeout(2000);

                // Try to get user info from Okta's user menu
                const email = await page.evaluate(() => {
                    // Okta dashboard shows user email in various places
                    const selectors = [
                        '[data-se="user-menu"] [data-se="user-name"]',
                        '.user-info .user-email',
                        '[data-se="dropdown-menu-button-header"]',
                        '.okta-dropdown--header .user-name',
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.textContent.includes('@')) return el.textContent.trim();
                    }
                    return null;
                });

                const name = await page.evaluate(() => {
                    const selectors = [
                        '[data-se="user-menu"] .user-name',
                        '.user-info .user-name',
                        '.okta-dropdown--header .display-name',
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el) return el.textContent.trim();
                    }
                    return null;
                });

                return { email, name };
            } catch {
                return { email: null, name: null };
            }
        }
    },
    azure: {
        loginUrl: () => 'https://myapps.microsoft.com',
        successPatterns: ['myapps.microsoft.com', 'portal.azure.com', 'office.com', 'microsoft365.com'],
        extractIdentity: async (page) => {
            try {
                await page.waitForTimeout(2000);
                // Try to navigate to Graph API for user info
                const meResponse = await page.evaluate(async () => {
                    try {
                        const res = await fetch('https://graph.microsoft.com/v1.0/me', {
                            credentials: 'include'
                        });
                        if (res.ok) return await res.json();
                    } catch { /* ignore */ }
                    return null;
                });

                if (meResponse) {
                    return {
                        email: meResponse.mail || meResponse.userPrincipalName,
                        name: meResponse.displayName
                    };
                }

                // Fallback: extract from page
                const email = await page.evaluate(() => {
                    const el = document.querySelector('#mectrl_currentAccount_secondary');
                    return el ? el.textContent.trim() : null;
                });

                return { email, name: null };
            } catch {
                return { email: null, name: null };
            }
        }
    },
    google: {
        loginUrl: () => 'https://accounts.google.com',
        successPatterns: ['myaccount.google.com', 'accounts.google.com/SignOutOptions'],
        extractIdentity: async (page) => {
            try {
                // After Google login, navigate to account page to get email
                await page.goto('https://myaccount.google.com/personal-info', {
                    waitUntil: 'domcontentloaded', timeout: 10000
                });
                await page.waitForTimeout(2000);

                const email = await page.evaluate(() => {
                    // Google shows email on the personal info page
                    const els = document.querySelectorAll('[data-email]');
                    if (els.length > 0) return els[0].getAttribute('data-email');
                    // Fallback: look for email pattern in text
                    const text = document.body.innerText;
                    const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
                    return match ? match[0] : null;
                });

                return { email, name: null };
            } catch {
                return { email: null, name: null };
            }
        }
    }
};

/**
 * Authenticate via Playwright (automatic credential capture)
 */
async function authenticateWithPlaywright(provider, domain, readline) {
    let playwright;
    try {
        playwright = require('playwright');
    } catch {
        return null; // Playwright not available
    }

    const config = IDP_CONFIG[provider];
    if (!config) return null;

    const loginUrl = config.loginUrl(domain);
    console.log(`\n  Opening browser for sign-in...`);
    console.log(`  Please log in with your company credentials.\n`);

    const browser = await playwright.chromium.launch({
        headless: false, // User needs to see and interact with the login page
        args: ['--disable-blink-features=AutomationControlled']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    try {
        await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for successful authentication (max 5 minutes)
        console.log('  Waiting for you to complete sign-in...');
        await page.waitForFunction(
            (patterns) => patterns.some(p => window.location.href.includes(p)),
            config.successPatterns,
            { timeout: 300000 } // 5 minute timeout
        );

        console.log('  Sign-in detected! Capturing identity...');

        // Extract user identity from the authenticated page
        const identity = await config.extractIdentity(page);

        await browser.close();
        return { email: identity.email, name: identity.name, provider };

    } catch (err) {
        try { await browser.close(); } catch { /* ignore */ }

        if (err.message && err.message.includes('Timeout')) {
            console.log('\n  Sign-in timed out (5 minutes). Please try again.');
        } else if (err.message && err.message.includes('Target closed')) {
            console.log('\n  Browser was closed before sign-in completed.');
        }
        return null;
    }
}

/**
 * Authenticate without Playwright (manual fallback)
 */
async function authenticateManual(provider, domain, rl) {
    const config = IDP_CONFIG[provider] || IDP_CONFIG.okta;
    const loginUrl = config.loginUrl(domain);

    console.log(`\n  Open this URL in your browser to sign in:`);
    console.log(`\n    ${loginUrl}\n`);

    // Try to open default browser (works on host, not in Docker)
    try {
        const openCmd = process.platform === 'win32' ? 'start'
                      : process.platform === 'darwin' ? 'open' : 'xdg-open';
        exec(`${openCmd} "${loginUrl}"`);
    } catch { /* ignore — user can open the URL manually */ }

    // Wait for user to confirm login
    const confirmed = await question(rl, '  Press Enter after you have logged in successfully...');

    // Ask for identity info manually
    const email = await question(rl, '  Your email address: ');
    const name = await question(rl, '  Your display name (optional, press Enter to skip): ');

    return {
        email: email.trim(),
        name: name.trim() || null,
        provider
    };
}

/**
 * Main authentication function — tries Playwright first, falls back to manual
 */
async function authenticate(provider, domain, rl) {
    // Try Playwright first
    const result = await authenticateWithPlaywright(provider, domain, rl);
    if (result && result.email) {
        return result;
    }

    // If Playwright captured something but no email, ask user to confirm
    if (result && !result.email) {
        console.log('\n  Identity could not be captured automatically.');
        const email = await question(rl, '  Your email address: ');
        return { email: email.trim(), name: result.name, provider };
    }

    // Playwright not available or failed — manual flow
    if (!result) {
        console.log('\n  (Automatic browser capture not available — using manual flow)');
    }

    return authenticateManual(provider, domain, rl);
}

function question(rl, prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

module.exports = { authenticate, authenticateWithPlaywright, authenticateManual };
