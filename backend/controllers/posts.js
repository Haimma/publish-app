const db = require('../db');

exports.addPosts = (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  let post = {
    appId: null,
    title: req.body.title,
    description: req.body.description,
    imgDir: url + '/images/' + req.file.filename,
    androidUrl	: req.body.androidUrl,
    iosUrl: req.body.iosUrl
  };
  let sql = 'INSERT INTO apps SET ?';
  let query = db.query(sql, post, (err, result) => {
      if(err) throw err;
      res.status(200).json({
        post: {
          ...result,
          appId: result.insertId,
          // title: result.title,
          // description: result.description,
          // imgDir: result.imgDir,
          // androidUrl: result.androidUrl,
          // iosUrl: result.iosUrl
        }
      });
  });
}

exports.getPosts = (req, res) => {
  let sql = 'SELECT * FROM apps';
  let query = db.query(sql, (err, result) => {
      if(err) throw err;
      res.status(200).json(result);
  });
}

exports.editPost = (req, res) => {
  let imgDir = req.body.imgDir;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imgDir = url + '/images/' + req.file.filename;
  }
  let post = {
    _appId: req.body.appId,
    title: req.body.title,
    description: req.body.description,
    imgDir,
    androidUrl	: req.body.androidUrl,
    iosUrl: req.body.iosUrl
  };
  let sql = 'UPDATE apps SET title=?, description=?, imgDir=?, androidUrl=?, iosUrl=? WHERE appId=?';
  let query = db.query(sql, [post.title, post.description, post.imgDir, post.androidUrl, post.iosUrl, post._appId], (err, result) => {
      if(err) throw err;
      res.status(200).json(result);
  });
}

exports.getPostById = (req, res) => {
  let sql = 'SELECT * FROM apps where appId=?';
  let query = db.query(sql, req.params.appId, (err, result) => {
    if (result) {
      res.status(200).json(result);
    }
    else {
      res.status(404).json();
    }
  });
}

exports.deletePost = (req, res) => {
  let sql = 'DELETE FROM apps where appId=?';
  let query = db.query(sql, req.params.appId, (err, result) => {
      if(err) throw err;
      res.status(200).json(result);
  });
}


