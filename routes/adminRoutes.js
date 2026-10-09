import express from 'express';

const router = express.Router();

// @desc    Admin Login Endpoint
// @route   POST /api/admin/login
// @access  Public
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'clyrova123';

  if (username === validUsername && password === validPassword) {
    const token = `clyrova_admin_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        username: validUsername,
        role: 'Super Admin',
        loginTime: new Date()
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid admin username or password. Please try again.'
  });
});

// @desc    Verify Admin Token
// @route   GET /api/admin/verify
// @access  Public
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && token.startsWith('clyrova_admin_token_')) {
    return res.status(200).json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

export default router;
