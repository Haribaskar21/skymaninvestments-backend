const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
console.log('verifyAdmin:', verifyAdmin);
console.log('deleteNews:', deleteNews);


// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Admin-only routes
router.post('/', verifyAdmin, createNews);
router.put('/:id', verifyAdmin, updateNews);
router.delete('/:id', verifyAdmin, deleteNews);

module.exports = router;
