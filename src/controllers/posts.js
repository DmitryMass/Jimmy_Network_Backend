import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res.status(500).send({ msg: 'User Not found (CreatePost)' });
    const { firstName, lastName, location, imgPath } = user;
    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      description,
      imgPath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    return res.status(200).send(post);
  } catch (err) {
    return res.status(401).send({ msg: `${err} - createPost Error` });
  }
};

export const getUsersPosts = async (req, res) => {
  try {
    const post = await Post.find();
    return res.status(200).send(post);
  } catch (error) {
    return res.status(404).send({ msg: `Posts not found` });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    return res.status(200).send(post);
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
