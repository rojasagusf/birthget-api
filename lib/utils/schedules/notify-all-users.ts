import User from '../../models/user.model';
import Friend from '../../models/friend.model';

export async function notifyAllUsers() {
  const toNotify = [];
  const users = await User.findAll({
    include: {
      model: Friend,
      as: 'friends'
    }
  });

  const notifyByEmail = users.filter((user) => user.source === 'email');

  notifyByEmail.forEach((user) => {
    user.friends.forEach((friend) => {
      if (new Date(friend.birthdate).toLocaleDateString() === new Date().toLocaleDateString()) {
        toNotify.push(friend);
      }
    });
  });
}
