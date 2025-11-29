# Admin Account Setup Guide

## Overview
This application now uses fixed admin accounts for secure admin dashboard access. Only authorized admins can log in and manage the system.

## Default Admin Credentials

**⚠️ IMPORTANT: Change these credentials immediately in production!**

```
Admin Account 1:
  Username: admin
  Email: admin@typroject.com
  Password: admin123

Admin Account 2:
  Username: superadmin
  Email: superadmin@typroject.com
  Password: superadmin@123
```

## How to Add or Modify Admin Accounts

1. Open `BackEnd/adminConfig.js`
2. Edit the `ADMIN_ACCOUNTS` array:

```javascript
export const ADMIN_ACCOUNTS = [
  {
    username: 'admin',
    email: 'admin@typroject.com',
    password: 'admin123', // Change this
  },
  {
    username: 'superadmin',
    email: 'superadmin@typroject.com',
    password: 'superadmin@123', // Change this
  },
  // Add more admins as needed
  {
    username: 'sai desai',
    email: 'sai@gmail.com',
    password: 'strongpassword123',
  },
];
```

3. Restart the backend server for changes to take effect.

## How Admin Authentication Works

### Backend Flow
1. Admin sends username/password to `/api/admin/login`
2. Backend validates against `ADMIN_ACCOUNTS` in `adminConfig.js`
3. If valid, returns a token (base64 encoded username:password)
4. All subsequent admin API calls require this token in the `Authorization` header

### Frontend Flow
1. Admin enters credentials on the AdminLogin page
2. Credentials sent to backend `/api/admin/login`
3. Token stored in `localStorage` as `adminToken`
4. Token automatically included in all admin API requests
5. If token is invalid/expired, admin is redirected to login page

## Admin API Endpoints

All admin endpoints require the `Authorization: Bearer <token>` header.

### Login
```
POST /api/admin/login
Body: { username: string, password: string }
Response: { success: boolean, message: string, token: string, admin: { username: string } }
```

### Stats
```
GET /admin/stats
Header: Authorization: Bearer <token>
```

### Users Management
```
GET /admin/users
GET /admin/users/:id
POST /admin/users
PUT /admin/users/:id
DELETE /admin/users/:id
Header: Authorization: Bearer <token>
```

### Bookings Management
```
GET /admin/bookings
PUT /admin/bookings/:id
Header: Authorization: Bearer <token>
```

## Production Security Recommendations

1. **Use Environment Variables**: Store credentials in `.env` file instead of hardcoding:
   ```javascript
   // adminConfig.js (production)
   export const ADMIN_ACCOUNTS = [
     {
       username: process.env.ADMIN_USERNAME,
       email: process.env.ADMIN_EMAIL,
       password: process.env.ADMIN_PASSWORD,
     }
   ];
   ```

2. **Use JWT Tokens**: Replace the base64 token with proper JWT tokens
   ```javascript
   import jwt from 'jsonwebtoken';
   const token = jwt.sign(
     { username, email },
     process.env.JWT_SECRET,
     { expiresIn: '24h' }
   );
   ```

3. **Enable HTTPS**: Use HTTPS in production
4. **Strong Passwords**: Enforce strong password policies
5. **Rate Limiting**: Add rate limiting to login endpoint to prevent brute force attacks
6. **Audit Logging**: Log all admin activities for security auditing

## Frontend Admin Auth Utilities

The following utility functions are available in `FrontEnd/src/utils/adminAuth.js`:

```javascript
// Get authorization header for API calls
getAdminAuthHeader() // Returns { Authorization: 'Bearer <token>' }

// Check if admin is authenticated
isAdminAuthenticated() // Returns boolean

// Get current admin username
getCurrentAdminUsername() // Returns string or null

// Logout admin
logoutAdmin() // Clears localStorage
```

Example usage:
```javascript
import { getAdminAuthHeader, isAdminAuthenticated } from '../utils/adminAuth';

// In your API call
const res = await fetch('http://localhost:5000/admin/stats', {
  headers: {
    ...getAdminAuthHeader()
  }
});

// Check authentication
if (!isAdminAuthenticated()) {
  // Redirect to login
}
```

## Testing Admin Features

1. Start the backend server
2. Navigate to the admin panel
3. Use default credentials to login
4. Admin token will be stored in browser localStorage
5. Access admin features with the authenticated session

## Troubleshooting

### "Invalid admin credentials" error
- Check username and password are correct
- Ensure credentials exist in `adminConfig.js`
- Restart backend server if you modified `adminConfig.js`

### "Unauthorized" or "Forbidden" error
- Admin token may be expired
- Clear localStorage and login again
- Check browser console for network errors

### Token not persisting after page refresh
- Check browser localStorage is not cleared on page close
- Check browser privacy/incognito mode settings
- Verify cookie settings allow localStorage

## Logout

Click the "Logout" button on the admin dashboard to:
- Clear the admin token from localStorage
- Clear the admin username from localStorage
- Redirect to the admin login page
