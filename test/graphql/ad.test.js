const assert = require('assert');
const AdGQL = require('../../graphql/ad');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');
const { Ad, Type, TransactionStatus, PublishStatus } = require('../../models/ad');
const { graphql } = require('graphql');

const mongoServer = new MongoMemoryServer();

describe('GraphQL Ad schema & handlers', () => {
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

    describe('Ad query', () => {
        it('should not return anything', async () => {
            const query = `{
                ad {
                    title,
                    description,
                    type,
                    price
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.ad.length, 0);
        });

        it('should not return anything', async () => {
            // inserting the test ad
            const expectedType = "SALE";
            const expectedPublishStatus = "PUBLISHED";
            const expectedTransactionStatus = "AVAILABLE";
            const expectedAd = {title: "test", description: "test", type: Type[expectedType], price: 20000, transaction_status: TransactionStatus[expectedTransactionStatus], publish_status: PublishStatus[expectedPublishStatus]};
            await Ad.insertMany([expectedAd]);
            
            const query = `{
                ad(title: "test2", description: "test", transactionStatus: AVAILABLE) {
                    title,
                    description,
                    type,
                    price,
                    transactionStatus,
                    publishStatus
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.ad.length, 0);
        });

        it('should return expected data', async () => {
            // inserting the test ad
            const expectedType = "SALE";
            const expectedAd = {title: "test", description: "test", type: Type[expectedType], price: 20000, transaction_status: "Disponible", publish_status: "Publiée"};
            await Ad.insertMany([expectedAd]);
            
            const query = `{
                ad {
                    title,
                    description,
                    type,
                    price
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            const resultAd = data.ad[0];

            assert.equal(resultAd.title, expectedAd.title);
            assert.equal(resultAd.description, expectedAd.description);
            assert.equal(resultAd.type, expectedType);
            assert.equal(resultAd.price, expectedAd.price);
            assert.equal(resultAd.transactionStatus, undefined);
        });

        it('should return expected data', async () => {
            // inserting the test ad
            const expectedType = "SALE";
            const expectedPublishStatus = "PUBLISHED";
            const expectedTransactionStatus = "AVAILABLE";
            const expectedAd = {title: "test", description: "test", type: Type[expectedType], price: 20000, transaction_status: TransactionStatus[expectedTransactionStatus], publish_status: PublishStatus[expectedPublishStatus]};
            await Ad.insertMany([expectedAd]);
            
            const query = `{
                ad(title: "test", description: "test", transactionStatus: AVAILABLE) {
                    title,
                    description,
                    type,
                    price,
                    transactionStatus,
                    publishStatus
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            const resultAd = data.ad[0];

            assert.equal(resultAd.title, expectedAd.title);
            assert.equal(resultAd.description, expectedAd.description);
            assert.equal(resultAd.type, expectedType);
            assert.equal(resultAd.price, expectedAd.price);
            assert.equal(resultAd.transactionStatus, expectedTransactionStatus);
            assert.equal(resultAd.publishStatus, expectedPublishStatus);
        });
    });
});