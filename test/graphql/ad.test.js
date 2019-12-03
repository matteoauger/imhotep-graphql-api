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
            const expectedAd = {title: "test", description: "test", type: Type.SALE, price: 20000, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED };
            await Ad.insertMany([expectedAd]);
            
            const query = `{
                ad(title: "test2", description: "test", transaction_status: AVAILABLE) {
                    title,
                    description,
                    type,
                    price,
                    transaction_status,
                    publish_status
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.ad.length, 0);
        });

        it('should return expected data', async () => {
            // inserting the test ad
            const expectedAd = { title: "test", description: "test", type: Type.SALE, price: 20000, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED };
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
            assert.equal(resultAd.type, expectedAd.type);
            assert.equal(resultAd.price, expectedAd.price);
            assert.equal(resultAd.transaction_status, undefined);
        });

        it('should return expected data', async () => {
            // inserting the test ad
            const expectedAd = {title: "test", description: "test", type: Type.SALE, price: 20000, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED };
            await Ad.insertMany([expectedAd]);
            
            const query = `{
                ad(title: "test", description: "test", transaction_status: AVAILABLE) {
                    title,
                    description,
                    type,
                    price,
                    transaction_status,
                    publish_status
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            const resultAd = data.ad[0];

            assert.equal(resultAd.title, expectedAd.title);
            assert.equal(resultAd.description, expectedAd.description);
            assert.equal(resultAd.type, expectedAd.type);
            assert.equal(resultAd.price, expectedAd.price);
            assert.equal(resultAd.transaction_status, expectedAd.transaction_status);
            assert.equal(resultAd.publish_status, expectedAd.publish_status);
        });
    });

    describe('Ads cheaper than', () => {
        it('should return nothing', async () => {
            const query = `{
                adCheaperThan(price: 1000, inclusive: true) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.adCheaperThan.length, 0);
        });

        it('should return the items cheaper than 200€', async () => {
            const ads = [
                { title: "test", description: "test", type: Type.SALE, price: 200, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED },
                { title: "test2", description: "test2", type: Type.RENTAL, price: 1000, transaction_status: TransactionStatus.NOT_AVAILABLE, publish_status: PublishStatus.UNPUBLISHED }
            ];

            await Ad.insertMany(ads);

            const query = `{
                adCheaperThan(price: 200) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.adCheaperThan.length, 0);
        });

        it('should return the items cheaper than 200€ (inclusive)', async () => {
            const ads = [
                { title: "test", description: "test", type: Type.SALE, price: 200, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED },
                { title: "test2", description: "test2", type: Type.RENTAL, price: 1000, transaction_status: TransactionStatus.NOT_AVAILABLE, publish_status: PublishStatus.UNPUBLISHED }
            ];

            await Ad.insertMany(ads);

            const query = `{
                adCheaperThan(price: 200, inclusive: true) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            assert.equal(data.adCheaperThan.length, 1);
            assert.equal(data.adCheaperThan[0].title, ads[0].title);
            assert.equal(data.adCheaperThan[0].description, ads[0].description);
        });
    });

    describe('Ad more expensive than', () => {
        it('should return nothing', async () => {
            const query = `{
                adMoreExpensiveThan(price: 1000, inclusive: true) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.adMoreExpensiveThan.length, 0);
        });

        it('should return the items more expensive than 200€', async () => {
            const ads = [
                { title: "test", description: "test", type: Type.SALE, price: 200, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED },
                { title: "test2", description: "test2", type: Type.RENTAL, price: 1000, transaction_status: TransactionStatus.NOT_AVAILABLE, publish_status: PublishStatus.UNPUBLISHED }
            ];

            await Ad.insertMany(ads);

            const query = `{
                adMoreExpensiveThan(price: 200) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal(data.adMoreExpensiveThan.length, 1);
        });

        it('should return the items more expensive than 200€ (inclusive)', async () => {
            const ads = [
                { title: "test", description: "test", type: Type.SALE, price: 200, transaction_status: TransactionStatus.AVAILABLE, publish_status: PublishStatus.PUBLISHED },
                { title: "test2", description: "test2", type: Type.RENTAL, price: 1000, transaction_status: TransactionStatus.NOT_AVAILABLE, publish_status: PublishStatus.UNPUBLISHED }
            ];

            await Ad.insertMany(ads);

            const query = `{
                adMoreExpensiveThan(price: 200, inclusive: true) {
                  id
                  title,
                  type,
                  publish_status,
                  transaction_status,
                  price,
                  description
                }
              }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            assert.equal(data.adMoreExpensiveThan.length, 2);
            assert.equal(data.adMoreExpensiveThan[0].title, ads[0].title);
            assert.equal(data.adMoreExpensiveThan[0].description, ads[0].description);
            assert.equal(data.adMoreExpensiveThan[1].title, ads[1].title);
            assert.equal(data.adMoreExpensiveThan[1].description, ads[1].description);
        });
    });

    describe('Ad insert', () => {
        it('should not insert successfully', async () => {
            const query = `mutation {
                insertAd(description: "test") {
                    id
                }
            }`;

            const { errors } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.notEqual(errors, undefined);
        });

        it('should insert correctly', async () => {
            const query = `mutation {
                insertAd(title: "test", description: "test", type: SALE, publish_status: PUBLISHED, price: 1000, transaction_status: AVAILABLE) {
                    id, 
                    title, 
                    type,
                    publish_status,
                    transaction_status,
                    description,
                    price
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            const insertedAd = await Ad.findOne({ title: "test" });
            assert.equal(data.insertAd.id, insertedAd._id);
            assert.equal(data.insertAd.title, insertedAd.title);
            assert.equal(data.insertAd.description, insertedAd.description);
            assert.equal(data.insertAd.publish_status, PublishStatus.PUBLISHED);
            assert.equal(data.insertAd.transaction_status, TransactionStatus.AVAILABLE);
            assert.equal(data.insertAd.price, insertedAd.price);
        });
    });

    describe('Ad update', () => {
        let ad = null; 

        before(() => {
            ad = {
                title: "test",
                description: "test",
                price: 109,
                publish_status: PublishStatus.UNPUBLISHED,
                type: Type.RENTAL,
                transaction_status: TransactionStatus.AVAILABLE
            };
        });

        beforeEach(async () => {
            await Ad.create(ad);
        });

        it('should not update', async () => {

            const query = `mutation {
                updateAd(id: "00000000", title: "test2") {
                    title
                }
            }`;

            const { errors } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.notEqual(errors, undefined);
        });

        it('should update', async () => {

            const insertedAd = await Ad.findOne({title: ad.title});

            const query = `mutation {
                updateAd(id: "${insertedAd._id}", title: "test2") {
                    title,
                    description,
                    publish_status,
                    price
                }
            }`;

            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.equal("test2", data.updateAd.title);
            assert.equal(ad.description, data.updateAd.description);
            assert.equal(ad.price, data.updateAd.price);
            assert.equal(PublishStatus.UNPUBLISHED, data.updateAd.publish_status);
        });
    });

    describe('Ad removal', () => {
        let ad = null; 

        before(() => {
            ad = {
                title: "test",
                description: "test",
                price: 109,
                publish_status: PublishStatus.UNPUBLISHED,
                type: Type.RENTAL,
                transaction_status: TransactionStatus.AVAILABLE
            };
        });

        beforeEach(async () => {
            await Ad.create(ad);
        });

        it('should not delete a non existing ad', async () => {
            const query = `mutation {
                deleteAd(id: "000000")
            }`;

            const { errors } = await graphql(AdGQL.schema, query, AdGQL.root);

            assert.notEqual(errors, undefined);
        });

        it('should delete an ad', async () => {
            const insertedAd = await Ad.findOne({title: ad.title});

            const query = `mutation {
                deleteAd(id: "${insertedAd._id}")
            }`;
            
            const { data } = await graphql(AdGQL.schema, query, AdGQL.root);
            assert.equal(true, data.deleteAd);
        });    
    });
});