const express = require("express");

const router = express.Router();

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split().join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const postsController = require('../controllers/posts')

router.post('/add', multer({storage}).single('imgDir'), postsController.addPosts);
router.get('/get', postsController.getPosts);
router.get('/get/:appId', postsController.getPostById);
router.put('/edit/:appId', multer({storage}).single('imgDir'), postsController.editPost);
router.delete('/delete/:appId', postsController.deletePost);

module.exports = router;
