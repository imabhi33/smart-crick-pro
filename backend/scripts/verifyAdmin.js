require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@smartcrick.com' });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Run: npm run create-admin');
      process.exit(1);
    }

    console.log('═══════════════════════════════════════');
    console.log('👤 ADMIN USER DETAILS');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('✅ Active:', admin.isActive);
    console.log('📅 Created:', admin.createdAt);
    console.log('═══════════════════════════════════════\n');

    if (admin.role !== 'admin') {
      console.log('⚠️  WARNING: User role is not "admin"!');
      console.log('Fixing role...\n');
      
      admin.role = 'admin';
      await admin.save();
      
      console.log('✅ Role updated to "admin"');
    } else {
      console.log('✅ Admin user is correctly configured!');
    }

    console.log('\n🌐 Login at: http://localhost:4000/login');
    console.log('📧 Email: admin@smartcrick.com');
    console.log('🔑 Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyAdmin();
