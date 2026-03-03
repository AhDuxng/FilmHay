const bcrypt = require('bcryptjs');
const supabase = require('../src/config/supabase.config');

const USERS = [
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'CHANGE_ME_PASSWORD_1', 
        role: 'user',
        is_active: true
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'CHANGE_ME_PASSWORD_2',
        role: 'user',
        is_active: true
    },
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'CHANGE_ME_PASSWORD_3',
        role: 'admin',
        is_active: true
    }
];

const SALT_ROUNDS = 10;

async function seedUsers() {
    console.log('=== SEEDING USERS ===\n');
    
    for (const user of USERS) {
        try {
            // Hash password
            const password_hash = await bcrypt.hash(user.password, SALT_ROUNDS);
            
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('username')
                .eq('username', user.username)
                .single();
            
            if (existingUser) {
                console.log(`User "${user.username}" already exists. Skipping...`);
                continue;
            }
            
            // Insert user
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        username: user.username,
                        email: user.email,
                        password_hash: password_hash,
                        role: user.role,
                        is_active: user.is_active,
                        created_at: new Date().toISOString(),
                    }
                ])
                .select();
            
            if (error) {
                console.log(`Failed to create user "${user.username}":`, error.message);
            } else {
                console.log(`User "${user.username}" created successfully!`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Password: ${user.password}`);
                console.log('');
            }
        } catch (err) {
            console.error(`Error creating user "${user.username}":`, err.message);
        }
    }
    
    console.log('\n=== SEEDING COMPLETE ===');
    console.log('\nYou can now login with these credentials:');
    USERS.forEach((user, index) => {
        console.log(`\n${index + 1}. Username: ${user.username}`);
        console.log(`   Password: ${user.password}`);
    });
}

seedUsers()
    .catch(console.error)
    .finally(() => process.exit());
