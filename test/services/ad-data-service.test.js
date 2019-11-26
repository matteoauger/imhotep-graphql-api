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
                transactionStatus: "AVAILABLE",
                publishStatus: "PUBLISHED"
            };
    
            const result = svc.prepareDataForDb(data);
            assert.equal(result._id, data.id);
            assert.equal(result.type, Ad.Type[data.type]);
            assert.equal(result.transaction_status, Ad.TransactionStatus[data.transactionStatus]);
            assert.equal(result.publish_status, Ad.PublishStatus[data.publishStatus]);

            // checking if the base fields have been removed
            assert.equal(result.id, undefined);
            assert.equal(result.transactionStatus, undefined);
            assert.equal(result.publishStatus, undefined);
        });

        it('should format data correctly', () => {
            const data = {
                title: "test",
                description: "test",
                type: "RENTAL",
                transactionStatus: "NOT_AVAILABLE",
                publishStatus: "UNPUBLISHED",
                price: 200
            };

            const result = svc.prepareDataForDb(data);
            
            assert.equal(result.title, data.title);
            assert.equal(result.description, data.description);
            assert.equal(result.price, data.price);
            assert.equal(result.type, Ad.Type[data.type]);
            assert.equal(result.transaction_status, Ad.TransactionStatus[data.transactionStatus]);
            assert.equal(result.publish_status, Ad.PublishStatus[data.publishStatus]);

            // checking if the base fields have been removed
            assert.equal(result.transactionStatus, undefined);
            assert.equal(result.publishStatus, undefined);
        });

        it('should throw an error on invalid type', () => {
            const data = {
                id: "test",
                title: "test",
                type: "test",
            };

            assert.throws(() => svc.prepareDataForDb(data));
        });

        it('should throw an error on invalid transaction status', () => {
            const data = {
                id: "test",
                title: "test",
                transactionStatus: "test",
            };

            assert.throws(() => svc.prepareDataForDb(data));
        });

        it('should throw an error on invalid publish status', () => {
            const data = {
                id: "test",
                title: "test",
                publishStatus: "test",
            };

            assert.throws(() => svc.prepareDataForDb(data));
        });
    });

    describe('Format mongoose output -> GQL output', () => {
        it('should format data correctly', () => {
            const data = {
                _id: "test",
                title: "test",
                description: "test",
                type: "Vente",
                transaction_status: "Disponible",
                publish_status: "Publiée",
                price: 200000
            };

            const result = svc.prepareDataForGql([data])[0];

            assert.equal(result.id, data._id);
            assert.equal(result.title, data.title);
            assert.equal(result.description, data.description);
            assert.equal(result.type, "SALE");
            assert.equal(result.transactionStatus, "AVAILABLE");
            assert.equal(result.publishStatus, "PUBLISHED");
            assert.equal(result.price, data.price);
        });

        it('should format data correctly', () => {
            const data = {
                _id: "test",
                title: "test",
                description: "test",
                type: "Location",
                transaction_status: "Non disponible",
                publish_status: "Non publiée",
                price: 500
            };

            const result = svc.prepareDataForGql([data])[0];

            assert.equal(result.id, data._id);
            assert.equal(result.title, data.title);
            assert.equal(result.description, data.description);
            assert.equal(result.type, "RENTAL");
            assert.equal(result.transactionStatus, "NOT_AVAILABLE");
            assert.equal(result.publishStatus, "UNPUBLISHED");
            assert.equal(result.price, data.price);
        });
    });
});