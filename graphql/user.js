const fs = require('fs');
const { buildSchema } = require('graphql');
const UserService = require('../services/user-service');
const UserDataService = require('../services/user-data-service');
const path = require('path');

class UserQueryHandler {
    constructor() {
        this.userService = new UserService();
        this.userDataService = new UserDataService();
    }

    async user(data) {
        const params = this.userDataService.prepareDataForDb(data);
        const users = await this.userService.getUser(params);
        
        return this.userDataService.prepareDataForGql(users);
    }

    async register(data) {
        const params = this.adDataService.prepareDataForDb(data);
        const newUser = await this.userService.insert(params);
        const result = this.adDataService.prepareDataForGql([ newUser ]);

        return result[0];
    }
}

// reading graphQL ad schema from gql file
const schemaPath = path.join(__dirname, 'gql-schemas', 'User.gql');
const schemaTxt = fs.readFileSync(schemaPath,  { encoding: 'utf-8' });

module.exports = {
    schema: buildSchema(schemaTxt),
    root: new UserQueryHandler()
}