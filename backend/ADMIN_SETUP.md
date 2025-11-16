# Admin User Setup Guide

## Default Admin Credentials

The system comes with a default admin account:

```
📧 Email:    admin@smartcrick.com
🔑 Password: admin123
👤 Role:     Admin
```

## How to Create Admin User

### Method 1: Using the Create Admin Script (Recommended)

Run this command from the backend directory:

```bash
npm run create-admin
```

This will create the default admin user with the credentials above.

### Method 2: Using the User Management Tool

For more advanced user management:

```bash
npm run manage-users
```

This interactive tool allows you to:
1. Create Admin User
2. Create Match Creator User
3. List All Users
4. Change User Role
5. Reset User Password
6. Delete User

### Method 3: Manual Database Entry

If you have MongoDB access, you can manually insert an admin user:

```javascript
{
  "name": "Admin User",
  "email": "admin@smartcrick.com",
  "password": "$2a$10$...", // Hashed password for "admin123"
  "role": "admin",
  "isActive": true,
  "createdAt": new Date()
}
```

## How Admin is Created

### 1. User Model Structure

The User model (`models/User.js`) has a `role` field with three possible values:
- `viewer` (default)
- `match_creator`
- `admin`

### 2. Password Hashing

Passwords are automatically hashed using bcrypt before saving:
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### 3. Admin Creation Process

```javascript
const admin = new User({
  name: 'Admin User',
  email: 'admin@smartcrick.com',
  password: 'admin123', // Will be hashed automatically
  role: 'admin',
  isActive: true
});
await admin.save();
```

## Admin Capabilities

Once logged in as admin, you can:

✅ **Application Management**
- View all Match Creator applications
- Approve applications
- Reject applications with reason
- Filter by status (Pending/Approved/Rejected)

✅ **Match Management**
- View all matches
- Create new matches
- Edit any match scorecard
- Start/Stop matches
- View match statistics

✅ **User Management**
- View all users (via database or scripts)
- Change user roles
- Reset passwords
- Delete users

## Changing User Role to Admin

### Using the Management Tool:
```bash
npm run manage-users
# Select option 4: Change User Role
# Enter user email
# Select role 3: admin
```

### Using MongoDB Directly:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Change Default Password**: After first login, change the default admin password
2. **Use Strong Passwords**: Always use strong, unique passwords for admin accounts
3. **Limit Admin Access**: Only create admin accounts for trusted users
4. **Regular Audits**: Regularly review admin accounts and their activities
5. **Environment Variables**: Store sensitive credentials in `.env` file

## Troubleshooting

### Admin User Already Exists
If you see "Admin user already exists", the default admin is already created. Use the credentials above to login.

### Cannot Connect to Database
Ensure your MongoDB connection string in `.env` is correct and your IP is whitelisted in MongoDB Atlas.

### Password Not Working
If the password doesn't work, reset it using:
```bash
npm run manage-users
# Select option 5: Reset User Password
```

## Login URL

Access the admin panel at:
```
http://localhost:4000/login
```

After login, you'll be automatically redirected to:
```
http://localhost:4000/admin
```

## Support

For issues or questions, check:
- Backend logs: `npm run dev`
- MongoDB connection: Check `.env` file
- User management: `npm run manage-users`
