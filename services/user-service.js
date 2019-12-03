const UserSchema = require('../models/user');
const User = UserSchema.User;

/**
 * Service fetching and modifying data from the user database.
 */
class UserService {

    getUsers(data) {
        return User.find(data);
    }

    insert(data) {
        return User.create(data);
    }

    update(id, data) {
        return User.updateOne({ _id: id }, data, { new: true });
    }

    delete(id) {
        return User.deleteOne({ _id: id });
    }
}

module.exports = UserService;