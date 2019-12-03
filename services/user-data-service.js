const { Role } = require('../models/user');

/**
 * Service formatting the user data to fit the graphql definition or the mongodb definition.
 */
class UserDataService {

    /**
     * Prepares the given query data to match mongoose definition.
     * @param {any} data graphql query input
     */
    prepareDataForDb(data) {
        const dataCpy = Object.assign({}, data);
        if (data.id) {
            dataCpy._id = data.id;
            delete dataCpy.id;
        }
        return dataCpy;
    }

    /**
     * Formats the data to match the GraphQL definition
     * @param {any} users database user array
     */
    prepareDataForGql(users) {
        const formatedUsers = users.map(user => ({
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role
        }));
        return formatedUsers;
    }
}

module.exports = UserDataService;