import * as dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();
import { compare, hash } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      imgPath,
      friends,
      location,
      occupation,
    } = req.body;

    if (!req.files) return res.status(404).json({ msg: 'No file uploaded' });
    const file = req.files.file;

    if (!file) {
      return res.status(404).json({ msg: 'Incorrect input name' });
    }
    const newFileName = encodeURI(Date.now() + '-' + file.name);

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(401).send({ msg: 'User is already Exist' });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      friends,
      location,
      occupation,
      imgPath: newFileName,
      password: await hash(password, 5),
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();

    file.mv(`${__dirname}/public/assets/${newFileName}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).json({ savedUser });
    });
  } catch (e) {
    return res.status(404).send(`Register Error`);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).send({ msg: `User doesn't exist.` });
    }
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({ msg: 'Bad credentials.' });
    }

    const token = sign({ id: user._id }, process.env.SECRET_KEY);

    return res.status(200).send({
      token,
      user,
    });
  } catch (e) {
    return res.status(500).send({ msg: `${e} - Error Login.` });
  }
};
