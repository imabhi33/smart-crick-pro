const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing admin login...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@smartcrick.com',
      password: 'admin123'
    });

    console.log('═══════════════════════════════════════');
    console.log('✅ LOGIN SUCCESSFUL');
    console.log('═══════════════════════════════════════');
    console.log('Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('═══════════════════════════════════════\n');

    if (response.data.data.role === 'admin') {
      console.log('✅ Role is correctly set to "admin"');
      console.log('✅ Admin dashboard should be accessible');
    } else {
      console.log('❌ Role is:', response.data.data.role);
      console.log('❌ Expected: admin');
    }

  } catch (error) {
    console.error('❌ Login failed:');
    console.error(error.response?.data || error.message);
  }
};

testLogin();
