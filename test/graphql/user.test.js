const assert = require('assert');
const UserGQL = require('../../graphql/user');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');
const { User, Role } = require('../../models/user');
const { graphql } = require('graphql');

const mongoServer = new MongoMemoryServer();

describe('GraphQL User schema & handlers', () => {
    /**
     * Before any test in this section
     * Connecting to a memory database for fast tests
     */
    before(async function () {
        const mongoUri = await mongoServer.getConnectionString();
        const mongooseOpts = {
            // options for mongoose 4.11.3 and above
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(mongoUri, mongooseOpts);
    });

    /**
     * After all tests in this section
     * Disconnecting memory database
     */
    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    describe('User query', () => {
        it('should not return anything', async () => {
            const query = `{
                user {
                    email,
                    firstname,
                    lastname,
                    role
                }
            }`;

            const { data } = await graphql(UserGQL.schema, query, UserGQL.root);

            assert.equal(data.user.length, 0);
        });

        it('should not return anything', async () => {
            // inserting the test user
            const expectedUser = { email: "test@mail.com", firstname: "fn", lastname: "ln", password: "abcdef", role: Role.REAL_ESTATE };
            await User.insertMany([expectedUser]);
            
            const query = `{
                user(email: "test2@mail.com") {
                    email,
                    firstname,
                    lastname
                    role
                }
            }`;

            const { data } = await graphql(UserGQL.schema, query, UserGQL.root);
            assert.equal(data.user.length, 0);
        });
        it('should return expected data', async () => {
            // inserting the test user
            const expectedUser = { email: "test2@mail.com", firstname: "fn", lastname: "ln", password: "abcdef", role: Role.REAL_ESTATE };
            await User.insertMany([expectedUser]);
            
            const query = `{
                user(email: "test2@mail.com") {
                    email,
                    firstname,
                    lastname
                    role
                }
            }`;

            const { data } = await graphql(UserGQL.schema, query, UserGQL.root);
            const user = data.user[0];
            assert.equal(user.email, expectedUser.email);
            assert.equal(user.firstname, expectedUser.firstname);
            assert.equal(user.lastname, expectedUser.lastname);
            assert.equal(user.role, expectedUser.role);
        });
    });
    describe('User removal', () => {
        let user = null;

        before(() => {
            user = {
                email: "dzqdqzd@gmail.com",
                firstname: "fn",
                lastname: "ln",
                password: "123456",
                role: Role.USER
            };
        });

        beforeEach(async () => {
            await User.create(user);
        });

        it('should not delete a non existing user', async () => {
            const query = `mutation {
                deleteUser(id: "000000")
            }`;

            const { errors } = await graphql(UserGQL.schema, query, UserGQL.root);

            assert.notEqual(errors, undefined);
        });

        it('should delete an user', async () => {
            const insertedUser = await User.findOne({email: email.email});

            const query = `mutation {
                deleteUser(id: "${insertedUser._id}")
            }`;
            
            const { data } = await graphql(UserGQL.schema, query, UserGQL.root);
            assert.equal(true, data.deleteUser);
        });    
    });
});