import express from 'express';
import { User, Booking, Admin } from './models.js';

const router = express.Router();

// Admin authentication middleware - validates token against database
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No admin token provided' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    
    if (!username || !password) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token format' });
    }

    // Validate against database
    const admin = await Admin.findOne({ username, password, isActive: true });
    
    if (!admin) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid admin credentials' });
    }

    req.admin = { username: admin.username, role: admin.role, id: admin._id };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

// Admin stats: counts and recent activity
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] GET /stats called by', req.ip || req.headers['x-forwarded-for'] || 'local');
    const totalBrands = await User.countDocuments({ type: 'brand', isDeleted: false });
    const totalModels = await User.countDocuments({ type: 'model', isDeleted: false });
    const totalBookings = await Booking.countDocuments({});
    const recentSignups = await User.find({}).sort({ createdAt: -1 }).limit(5).select('username email type createdAt');
    const recentBookings = await Booking.find({}).sort({ createdAt: -1 }).limit(5).populate('modelId', 'username email');

    res.json({ success: true, data: { totalBrands, totalModels, totalBookings, recentSignups, recentBookings } });
  } catch (err) {
    console.error('Admin stats error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: list users (with search, pagination)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] GET /users', { q: req.query.q, page: req.query.page, limit: req.query.limit });
    const { q, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { username: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') }
      ];
    }
    const users = await User.find(filter).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total });
  } catch (err) {
    console.error('Admin users list error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: create user
router.post('/users', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] POST /users', req.body);
    const { username, email, password, type, isAdmin } = req.body;
    if (!username || !email || !password || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, error: 'Email already in use' });

    const user = new User({ username, email, password, type, isAdmin: !!isAdmin });
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Admin create user error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: get user
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] GET /users/:id', req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Admin get user error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: update user (edit fields)
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] PUT /users/:id', req.params.id, req.body);
    const updates = { ...req.body };
    if (updates.isAdmin === undefined) delete updates.isAdmin;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Admin update user error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: soft delete user
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] DELETE /users/:id', req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Admin delete user error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: restore soft-deleted user
router.post('/users/:id/restore', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] POST /users/:id/restore', req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: false, deletedAt: null }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Admin restore user error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: bookings list
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] GET /bookings', { q: req.query.q, page: req.query.page, limit: req.query.limit });
    const { page = 1, limit = 50, q } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { brandName: new RegExp(q, 'i') },
        { brandEmail: new RegExp(q, 'i') }
      ];
    }
    const bookings = await Booking.find(filter).skip((page - 1) * limit).limit(Number(limit)).populate('modelId', 'username email');
    const total = await Booking.countDocuments(filter);
    res.json({ success: true, bookings, total });
  } catch (err) {
    console.error('Admin bookings list error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: update booking status or archive
router.put('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    console.log('[admin] PUT /bookings/:id', req.params.id, req.body);
    const updates = { ...req.body };
    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Admin update booking error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

  // Admin: manage admin accounts - list all admins
  router.get('/admins', requireAdmin, async (req, res) => {
    try {
      console.log('[admin] GET /admins');
      // Only superadmin can view all admins
      if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, error: 'Only superadmin can manage admin accounts' });
      }
      const admins = await Admin.find({}, { password: 0 }); // Exclude passwords from response
      res.json({ success: true, admins });
    } catch (err) {
      console.error('Admin list error', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  // Admin: create new admin account
  router.post('/admins', requireAdmin, async (req, res) => {
    try {
      console.log('[admin] POST /admins', { username: req.body.username, email: req.body.email });
      // Only superadmin can create new admins
      if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, error: 'Only superadmin can create admin accounts' });
      }

      const { username, email, password, fullName, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: 'Username, email, and password are required' });
      }

      // Check if username or email already exists
      const existing = await Admin.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Username or email already exists' });
      }

      const admin = new Admin({
        username,
        email,
        password,
        fullName: fullName || username,
        role: role || 'admin',
        isActive: true
      });

      await admin.save();
      const adminData = admin.toObject();
      delete adminData.password;

      res.status(201).json({ success: true, admin: adminData });
    } catch (err) {
      console.error('Admin create error', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  // Admin: update admin account
  router.put('/admins/:id', requireAdmin, async (req, res) => {
    try {
      console.log('[admin] PUT /admins/:id', req.params.id);
      // Only superadmin can update admin accounts
      if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, error: 'Only superadmin can update admin accounts' });
      }

      const { fullName, role, isActive, password } = req.body;
      const updates = { updatedAt: new Date() };

      if (fullName !== undefined) updates.fullName = fullName;
      if (role !== undefined && ['admin', 'superadmin'].includes(role)) updates.role = role;
      if (isActive !== undefined) updates.isActive = isActive;
      if (password !== undefined) updates.password = password;

      const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
      if (!admin) {
        return res.status(404).json({ success: false, error: 'Admin not found' });
      }

      res.json({ success: true, admin });
    } catch (err) {
      console.error('Admin update error', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  // Admin: delete admin account
  router.delete('/admins/:id', requireAdmin, async (req, res) => {
    try {
      console.log('[admin] DELETE /admins/:id', req.params.id);
      // Only superadmin can delete admin accounts
      if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, error: 'Only superadmin can delete admin accounts' });
      }

      // Prevent deleting yourself
      if (req.admin.id === req.params.id) {
        return res.status(400).json({ success: false, error: 'Cannot delete your own admin account' });
      }

      const admin = await Admin.findByIdAndDelete(req.params.id);
      if (!admin) {
        return res.status(404).json({ success: false, error: 'Admin not found' });
      }

      res.json({ success: true, message: 'Admin account deleted' });
    } catch (err) {
      console.error('Admin delete error', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });
export default router;
