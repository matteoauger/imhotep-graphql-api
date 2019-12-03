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

        if (data.role !== undefined) {
            if (Role[data.role] === undefined) {
                throw new Error(`${data.role} is not a valid type.`);
            }
            dataCpy.role_id = Role[data.role];
            delete dataCpy.role_id;
        }

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
            role: Role[user.role_id] 
        }));
        return formatedUsers;
    }
}

module.exports = UserDataService;