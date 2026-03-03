const bcrypt = require('bcryptjs');

const PASSWORDS_TO_HASH = [
    'Admin@123',
    'User@123',
    // Add more passwords here
];

const SALT_ROUNDS = 10;

async function generateHashes() {
    console.log('=== GENERATING PASSWORD HASHES ===\n');
    
    for (const password of PASSWORDS_TO_HASH) {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log('---');
    }
    
    console.log('\n=== VERIFICATION TEST ===\n');
    
    // Test verification
    const testPassword = PASSWORDS_TO_HASH[0];
    const testHash = await bcrypt.hash(testPassword, SALT_ROUNDS);
    const isValid = await bcrypt.compare(testPassword, testHash);
    
    console.log(`Test Password: ${testPassword}`);
    console.log(`Test Hash: ${testHash}`);
    console.log(`Verification: ${isValid ? '✓ SUCCESS' : '✗ FAILED'}`);
}

generateHashes().catch(console.error);
