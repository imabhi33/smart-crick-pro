require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const manageUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('═══════════════════════════════════════');
    console.log('👥 USER MANAGEMENT TOOL');
    console.log('═══════════════════════════════════════');
    console.log('1. Create Admin User');
    console.log('2. Create Match Creator User');
    console.log('3. List All Users');
    console.log('4. Change User Role');
    console.log('5. Reset User Password');
    console.log('6. Delete User');
    console.log('═══════════════════════════════════════\n');

    const choice = await question('Enter your choice (1-6): ');

    switch (choice) {
      case '1':
        await createAdmin();
        break;
      case '2':
        await createMatchCreator();
        break;
      case '3':
        await listUsers();
        break;
      case '4':
        await changeUserRole();
        break;
      case '5':
        await resetPassword();
        break;
      case '6':
        await deleteUser();
        break;
      default:
        console.log('❌ Invalid choice');
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

const createAdmin = async () => {
  const name = await question('Enter admin name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('❌ User with this email already exists!');
    return;
  }

  const admin = new User({
    name,
    email,
    password,
    role: 'admin',
    isActive: true
  });

  await admin.save();
  console.log('\n✅ Admin user created successfully!');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
};

const createMatchCreator = async () => {
  const name = await question('Enter name: ');
  const email = await question('Enter email: ');
  const password = await question('Enter password: ');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('❌ User with this email already exists!');
    return;
  }

  const creator = new User({
    name,
    email,
    password,
    role: 'match_creator',
    isActive: true
  });

  await creator.save();
  console.log('\n✅ Match Creator user created successfully!');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
};

const listUsers = async () => {
  const users = await User.find().select('-password');
  console.log('\n═══════════════════════════════════════');
  console.log('📋 ALL USERS');
  console.log('═══════════════════════════════════════');
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Role: ${user.role}`);
    console.log(`   ✅ Active: ${user.isActive}`);
  });
  console.log('═══════════════════════════════════════\n');
};

const changeUserRole = async () => {
  const email = await question('Enter user email: ');
  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log('\nCurrent role:', user.role);
  console.log('1. viewer');
  console.log('2. match_creator');
  console.log('3. admin');
  const roleChoice = await question('Enter new role (1-3): ');

  const roles = { '1': 'viewer', '2': 'match_creator', '3': 'admin' };
  const newRole = roles[roleChoice];

  if (!newRole) {
    console.log('❌ Invalid role choice');
    return;
  }

  user.role = newRole;
  await user.save();
  console.log(`✅ User role updated to: ${newRole}`);
};

const resetPassword = async () => {
  const email = await question('Enter user email: ');
  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  const newPassword = await question('Enter new password: ');
  user.password = newPassword;
  await user.save();
  console.log('✅ Password reset successfully!');
};

const deleteUser = async () => {
  const email = await question('Enter user email to delete: ');
  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  const confirm = await question(`⚠️  Are you sure you want to delete ${user.name}? (yes/no): `);
  if (confirm.toLowerCase() === 'yes') {
    await User.deleteOne({ email });
    console.log('✅ User deleted successfully!');
  } else {
    console.log('❌ Deletion cancelled');
  }
};

manageUsers();
