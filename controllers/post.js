const Post = require('../models/post');
const authenticate = require('../middleware/auth');

const get_all_posts = (req, res, next) => {
  Post.find()
    .populate({ path: 'user', select: 'first_name last_name email' })
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      return res.json(posts);
    });
};

const get_post = (req, res, next) => {
  Post.findById(req.params.id)
    .populate({ path: 'user', select: 'first_name last_name email' })
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      if (!post) {
        return res.status(404).json({ error: 'post not found' });
      }
      return res.json(post);
    });
};

const create_post = [
  authenticate,
  (req, res, next) => {
    const post = new Post({
      user: req.decodedToken.id,
      title: req.body.title,
      body: req.body.body,
    });

    post.save((err, post) => {
      if (err) {
        return next(err);
      }
      return res.json(post);
    });
  },
];

const update_post = [
  authenticate,
  (req, res, next) => {
    Post.findById(req.params.id).exec((err, post) => {
      if (err) {
        return next(err);
      }
      if (!post) {
        return res.status(404).json({ error: 'post not found' });
      }

      post.title = req.body.title;
      post.body = req.body.body;

      if (req.body.hidden !== undefined) {
        post.hidden = req.body.hidden;
      }

      post.save((err, post) => {
        if (err) {
          return next(err);
        }
        return res.json(post);
      });
    });
  },
];

const remove_post = [
  authenticate,
  (req, res, next) => {
    Post.findById(req.params.id).exec((err, post) => {
      if (err) {
        return next(err);
      }
      if (!post) {
        return res.status(404).json({ error: 'post not found' });
      }
      post.remove((err, post) => {
        if (err) {
          return next(err);
        }
        res.json(post);
      });
    });
  },
];

module.exports = {
  get_all_posts,
  get_post,
  create_post,
  update_post,
  remove_post,
};
