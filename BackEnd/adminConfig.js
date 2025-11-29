
export const DEFAULT_ADMINS = [
  {
    username: 'admin',
    email: 'admin@typroject.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
  },
  {
    username: 'superadmin',
    email: 'superadmin@typroject.com',
    password: 'superadmin@123',
    fullName: 'Super Admin',
    role: 'superadmin',
  },
];

// Initialize default admins in database
export const initializeDefaultAdmins = async (AdminModel) => {
  try {
    const adminCount = await AdminModel.countDocuments();
    
    // Only add default admins if none exist
    if (adminCount === 0) {
      await AdminModel.insertMany(DEFAULT_ADMINS);
      console.log('✓ Default admin accounts created in database');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error initializing default admins:', err);
    return false;
  }
};

