const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail, sendLoginEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_123!@#', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, companyDetails } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Candidate',
      companyDetails: role === 'Recruiter' ? companyDetails : undefined
    });

    if (user) {
      // Send registration confirmation email asynchronously
      sendRegistrationEmail(user.email, user.name, user.role).catch(err => {
        console.error('Error sending registration email:', err);
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyDetails: user.companyDetails,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Failed to register user: invalid schema data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Send login notification email asynchronously
        sendLoginEmail(user.email, user.name).catch(err => {
          console.error('Error sending login notification email:', err);
        });

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyDetails: user.companyDetails,
          token: generateToken(user._id)
        });
      }
    }
    
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyDetails: user.companyDetails
      });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      if (user.role === 'Recruiter' && req.body.companyDetails) {
        user.companyDetails = {
          ...user.companyDetails,
          ...req.body.companyDetails
        };
      }

      const updatedUser = await User.findByIdAndUpdate(user._id, user);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyDetails: updatedUser.companyDetails,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
