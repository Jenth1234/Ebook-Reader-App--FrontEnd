// logout.js

const express = require('express');
const router = express.Router();

// Endpoint logout
router.post('/', (req, res) => {
  // Xóa thông tin phiên đăng nhập
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ success: false, error: "Logout failed" });
    } else {
      res.json({ success: true, message: "Logout successful" });
    }
  });
});

module.exports = router;
