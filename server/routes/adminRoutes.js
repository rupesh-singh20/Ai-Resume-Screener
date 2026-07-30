const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Group routes under Admin protection
router.use(protect, authorize('Admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
