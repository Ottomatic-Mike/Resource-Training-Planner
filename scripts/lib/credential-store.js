/**
 * Credential Store — AES-256-GCM encrypted storage
 * Matches ServiceNow MCP Server's encryption approach.
 *
 * - AES-256-GCM (authenticated encryption)
 * - PBKDF2 key derivation (100,000 iterations)
 * - Random salt + IV per encryption
 * - Separate key file for Docker host↔container compatibility
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits (GCM recommended)
const SALT_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha512';

function deriveKey(passphrase, salt) {
    return crypto.pbkdf2Sync(passphrase, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
}

function encrypt(data, passphrase) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(passphrase, salt);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const plaintext = JSON.stringify(data);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        version: 1,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        ciphertext: encrypted.toString('base64')
    };
}

function decrypt(blob, passphrase) {
    const salt = Buffer.from(blob.salt, 'base64');
    const iv = Buffer.from(blob.iv, 'base64');
    const authTag = Buffer.from(blob.authTag, 'base64');
    const ciphertext = Buffer.from(blob.ciphertext, 'base64');
    const key = deriveKey(passphrase, salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return JSON.parse(decrypted.toString('utf8'));
}

function saveCredentials(dataDir, data) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Generate a random passphrase for encryption
    const passphrase = crypto.randomBytes(32).toString('hex');

    // Encrypt the data
    const blob = encrypt(data, passphrase);

    // Write encrypted credentials
    const credPath = path.join(dataDir, 'credentials.enc');
    fs.writeFileSync(credPath, JSON.stringify(blob, null, 2), { mode: 0o600 });

    // Write key file (separate from credentials)
    const keyPath = path.join(dataDir, 'credentials.key');
    fs.writeFileSync(keyPath, passphrase, { mode: 0o600 });

    return { credPath, keyPath };
}

function loadCredentials(dataDir) {
    const credPath = path.join(dataDir, 'credentials.enc');
    const keyPath = path.join(dataDir, 'credentials.key');

    if (!fs.existsSync(credPath) || !fs.existsSync(keyPath)) {
        return null;
    }

    const passphrase = fs.readFileSync(keyPath, 'utf8').trim();
    const blob = JSON.parse(fs.readFileSync(credPath, 'utf8'));

    return decrypt(blob, passphrase);
}

module.exports = { encrypt, decrypt, saveCredentials, loadCredentials };
