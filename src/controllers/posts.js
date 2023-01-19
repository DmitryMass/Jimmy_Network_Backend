import Post from '../models/Post.js';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (req, res) => {
  try {
    const { userId, description, userImgPath } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res.status(500).send({ msg: 'User Not found (CreatePost)' });

    const { firstName, lastName, location, imgPath } = user;
    if (!req.files) {
      const newPost = new Post({
        userId,
        firstName,
        lastName,
        location,
        description,
        imgPath,
        userImgPath,
        likes: {},
        comments: [],
      });
      await newPost.save();
      const post = await Post.find();
      return res.status(200).json(post.reverse());
    } else {
      const file = req.files.file;
      const newFileName = encodeURI(Date.now() + '-' + file?.name);
      const newPost = new Post({
        userId,
        firstName,
        lastName,
        location,
        description,
        imgPath,
        userImgPath: newFileName,
        likes: {},
        comments: [],
      });
      await newPost.save();
      const post = await Post.find();

      file.mv(`${__dirname}/public/assets/${newFileName}`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.status(200).json(post.reverse());
      });
    }
  } catch (err) {
    return res.status(401).send({ msg: `${err} - createPost Error` });
  }
};

export const getUsersPosts = async (req, res) => {
  try {
    const post = await Post.find();
    return res.status(200).send(post.reverse());
  } catch (error) {
    return res.status(404).send({ msg: `Posts not found` });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    return res.status(200).send(post.reverse());
  } catch (err) {
    return res.status(404).send({ msg: 'User Posts not found' });
  }
};

export const likedPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post?.likes?.get(userId);
    if (isLiked) {
      post?.likes?.delete(userId);
    } else {
      post?.likes?.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post?.likes },
      { new: true }
    );

    return res.status(200).send(updatedPost);
  } catch (err) {
    return res.status(401).send({ msg: 'Like request was failed' });
  }
};
