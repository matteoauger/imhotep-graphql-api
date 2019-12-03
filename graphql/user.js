const fs = require('fs');
const { buildSchema } = require('graphql');
const UserService = require('../services/user-service');
const UserDataService = require('../services/user-data-service');
const path = require('path');
const bcrypt = require('bcrypt');

const HASH_ROUNDS = 10;

class UserQueryHandler {
    constructor() {
        this.userService = new UserService();
        this.userDataService = new UserDataService();
    }

    async user(data) {
        const params = this.userDataService.prepareDataForDb(data);
        const users = await this.userService.getUsers(params);
        
        return this.userDataService.prepareDataForGql(users);
    }

    async insertUser(data) {
        data.password = bcrypt.hashSync(data.password, HASH_ROUNDS);
        const params = this.userDataService.prepareDataForDb(data);
        const newUser = await this.userService.insert(params);
        const result = this.userDataService.prepareDataForGql([ newUser ]);

        return result[0];
    }

    async updateUser(data) {
        const params = this.userDataService.prepareDataForDb(data);
        const id = params._id;
        delete params._id;
        if (params.password) {
            params.password = bcrypt.hashSync(params.password, HASH_ROUNDS);
        }
        const updatedAd = await this.userService.update(id, params, { new: true });

        const result = this.userDataService.prepareDataForGql([updatedAd]);
        return result[0];
    }

    async deleteUser({ email }) {
        const response = await this.userService.delete(email);
        return response.ok  === 1 && response.deletedCount > 0;
    }
}

// reading graphQL user schema from gql file
const schemaPath = path.join(__dirname, 'gql-schemas', 'User.gql');
const schemaTxt = fs.readFileSync(schemaPath,  { encoding: 'utf-8' });

module.exports = {
    schema: buildSchema(schemaTxt),
    root: new UserQueryHandler()
}