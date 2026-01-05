import User from '../models/User.js';

export const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@quizii.ai';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword, // Will be hashed by pre-save hook
                role: 'admin'
            });
            console.log('--- Default Admin Account Created ---');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('-----------------------------------');
        } else {
            console.log('Admin account already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};
