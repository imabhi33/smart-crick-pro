require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@smartcrick.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@smartcrick.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@smartcrick.com',
      password: 'admin123',
      mobile: '9999999999',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📋 ADMIN LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    admin@smartcrick.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role:     Admin');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🌐 Login at: http://localhost:4000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
