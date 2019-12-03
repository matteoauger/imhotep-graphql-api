const assert = require('assert');
const AdDataService = require('../../services/ad-data-service');
const Ad = require('../../models/ad');

const svc = new AdDataService();

describe('Ad data service', () => {
    describe('Format GQL query input -> Mongoose query input', () => {
        it('should format data correctly', () => {
            const data = {
                id: "test",
                type: "SALE",
                transactions_tatus: "AVAILABLE",
                publishStatus: "PUBLISHED"
            };
    
            const result = svc.prepareDataForDb(data);
            assert.equal(result._id, data.id);
            assert.equal(result.type, data.type);
            assert.equal(result.transaction_status, data.transaction_status);
            assert.equal(result.publish_status, data.publish_status);
        });
    });

    describe('Format mongoose output -> GQL output', () => {
        it('should format data correctly', () => {
            const data = {
                _id: "test",
                title: "test",
                description: "test",
                type: "RENT",
                transaction_status: "AVAILABLE",
                publish_status: "PUBLISHED",
                price: 200000
            };

            const result = svc.prepareDataForGql([data])[0];

            assert.equal(result.id, data._id);
            assert.equal(result.title, data.title);
            assert.equal(result.description, data.description);
            assert.equal(result.type, data.type);
            assert.equal(result.transaction_status, data.transaction_status);
            assert.equal(result.publish_status, data.publish_status);
            assert.equal(result.price, data.price);
        });
    });
});