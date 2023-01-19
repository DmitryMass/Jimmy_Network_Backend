import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.status(200).send(user);
  } catch (err) {
    return res.status(404).send({ msg: `${err} user didn't get.` });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const group = friends.map(
      ({ _id, firstName, lastName, occupation, location, imgPath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          imgPath,
        };
      }
    );

    return res.status(200).send(group);
  } catch (err) {
    return res.status(404).send({ msg: `${err} - userFriends didn't get` });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user) {
      return res.status(404).send({ msg: 'User not found' });
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      if (friend?.friends) {
        friend.friends = friend?.friends.filter((id) => id !== id);
      }
    } else {
      user.friends.push(friendId);
      friend?.friends.push(id);
    }

    await user.save();
    await friend?.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const groupFriend = friends.map(
      ({ _id, firstName, lastName, occupation, location, imgPath }) => {
        return { _id, firstName, lastName, occupation, location, imgPath };
      }
    );

    return res.status(200).send(groupFriend);
  } catch (err) {
    return res
      .status(404)
      .send({ msg: `${err} - doesn't add or remove friend.` });
  }
};
