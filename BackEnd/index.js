import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcryptjs from 'bcryptjs';
import { initializeDefaultAdmins } from './adminConfig.js';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

const mongoUri = 'mongodb://127.0.0.1:27017/ty-db';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, ' MongoDB connection error:'));

import { User, Booking, Admin } from './models.js';

// When DB opens, log and initialize default admins
db.once('open', async () => {
  console.log(' Connected to Local MongoDB Database: ty-db');
  try {
    await initializeDefaultAdmins(Admin);
  } catch (err) {
    console.error('Error initializing default admins on startup:', err);
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    let userData = { ...req.body };

    // For brands, keep only: username, email, password, type, contact, brandDesc
    if (req.body.type === 'brand') {
      userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        type: 'brand',
        contact: req.body.contact,
        brandDesc: req.body.brandDesc,
      };
    }

    // Ensure models include gender explicitly (safe-guard in case frontend omitted it)
    if (req.body.type === 'model') {
      userData = { ...userData, gender: req.body.gender || null };
    }

    const user = new User(userData);
    await user.save();
    console.log(' User saved:', user);

    //  Send response for frontend navigation
    res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error(' Error saving user:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare plaintext password with hashed password stored in DB
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (isPasswordValid) {
      res.json({ success: true, message: 'Login successful', user });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(' Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin login endpoint - validates against database
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    // Find admin in database
    const admin = await Admin.findOne({ username, isActive: true });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    // Generate token: base64(username:password)
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: { 
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(' Admin login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get users with filters
app.get('/api/users', async (req, res) => {
  try {
    const {
      type,
      skills,
      availability,
      location,
      search
    } = req.query;

    let query = {};

    // Add filters if they exist
    if (type && ['brand', 'model'].includes(type)) {
      query.type = type;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    if (availability) {
      query.availability = availability;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { brandDesc: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') }
      ];
    }

    // Exclude soft-deleted users always
    query.isDeleted = { $ne: true };

    // Exclude any models that currently have an accepted booking (regardless of date).
    // When an admin sets a booking to 'accepted', the model will be hidden from
    // public listings. If the booking status is changed back to 'pending',
    // 'completed' or 'cancelled', the model will reappear.
    const acceptedBookings = await Booking.find({ status: 'accepted', archived: { $ne: true } });
    const unavailableIds = new Set(acceptedBookings.map(b => (b.modelId ? String(b.modelId) : null)).filter(Boolean));

    if (unavailableIds.size > 0) {
      query._id = { $nin: Array.from(unavailableIds) };
    }

    // Make the isDeleted filter explicit: include users where isDeleted is not true
    // (covers missing field or false). This is defensive against any string-typed values.
    if (!query.$or && !query._id) {
      // ensure query keeps any existing predicates
      query = { ...query };
    }

    const users = await User.find(query);

    // Get unique skills/locations only from non-deleted users
    const nonDeletedFilter = { isDeleted: { $ne: true } };
    const allSkills = await User.distinct('skills', nonDeletedFilter);
    const allLocations = await User.distinct('location', nonDeletedFilter);

    console.log(`[api] GET /api/users -> returning ${users.length} users; unavailableIds=${unavailableIds.size}`);

    res.json({ 
      success: true, 
      users,
      metadata: {
        totalCount: users.length,
        availableSkills: allSkills.filter(Boolean), // Remove null/empty values
        availableLocations: allLocations.filter(Boolean)
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const { modelId, brandName, brandEmail, contact, startDate, days, message } = req.body;

    if (!modelId || !brandName || !brandEmail || !startDate || !days) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    // Validate model exists
    const modelUser = await User.findById(modelId);
    if (!modelUser) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }

    // Compute total price server-side (use model's pricePerDay)
    const perDay = typeof modelUser.pricePerDay === 'number' ? modelUser.pricePerDay : 0;
    const totalPrice = perDay * Number(days);

    const booking = new Booking({
      modelId,
      brandName,
      brandEmail,
      contact,
      startDate: new Date(startDate),
      days: Number(days),
      totalPrice,
      message
    });

    await booking.save();

    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

import adminRouter from './adminRoutes.js';
app.use('/admin', adminRouter);


// âœ… Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
