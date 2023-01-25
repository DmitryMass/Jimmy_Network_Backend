import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/verifyUserToken.js';
import authRoute from './router/authRoute.js';
import userRoute from './router/userRoute.js';
import postsRoute from './router/postsRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config
// mongoose.set('strictQuery', false);

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: '*',
    credentials: true,
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

app.post('/auth/register', register);
app.post('/posts', verifyToken, createPost);
// main routes
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/posts', postsRoute);
app.use(
  '/assets',
  express.static(path.join(__dirname, './controllers/public/assets'))
);
// test route

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(process.env.PORT || 3005, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.log(`${e} server is down`);
  }
};

start();

// storage

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// import multer from 'multer';
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/assets');
//   },
//   filename: function (req, file, cb) {
//     console.log(file);
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });
// upload.single('picture')
// upload.single('picture')
