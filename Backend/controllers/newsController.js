
const News = require('../models/News');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single('image');

exports.upload = upload;


exports.createNews = async (req, res) => {
  const { title, content, category, tags, image, link } = req.body;
  const tagsArray = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];

  const news = new News({ title, content, category, tags: tagsArray, image, link });
  await news.save();
  res.status(201).json(news);
};

exports.getAllNews = async (req, res) => {
  const newsList = await News.find();
  const newsWithUrls = newsList.map(news => {
    const obj = news.toObject();
    obj.imageUrl = news.image ? `${req.protocol}://${req.get('host')}/uploads/${news.image}` : '';
    return obj;
  });
  res.json(newsWithUrls);
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'news not found' });

    const newsObj = news.toObject();
    newsObj.imageUrl = news.image ? `${req.protocol}://${req.get('host')}/uploads/${news.image}` : '';
    newsObj.link = news.link || ''; // ✅ ensure link is always sent

    res.json(newsObj);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, image, link } = req.body;

  const updateData = { title, content, category, tags, image, link };
  const news = await News.findByIdAndUpdate(id, updateData, { new: true });
  res.json(news);
};

exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  await News.findByIdAndDelete(id);
  res.json({ message: 'News deleted' });
};