import { verify } from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(404).send({ msg: 'Verify does not valid' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verifyUser = verify(token, process.env.SECRET_KEY);

    req.user = verifyUser;
    next();
  } catch (err) {
    return res.status(500).send({ msg: `${err} verify error.` });
  }
};
