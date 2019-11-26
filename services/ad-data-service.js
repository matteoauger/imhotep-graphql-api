const { Type, TransactionStatus, PublishStatus } = require('../models/ad');
const { getKeyByValue } = require('../utils/object-util');

/**
 * Service formatting the ad data to fit the graphql definition or the mongodb definition.
 */
class AdDataService {
    /**
     * Prepares the given query data to match mongoose definition.
     * @param {any} data graphql query input
     */
    prepareDataForDb(data) {
        const dataCpy = Object.assign({}, data);

        if (data.type) {
            if (!Type[data.type])
                throw Error(`${data.type} is not a valid type. This problem is related to the database, please contact an administrator.`);

            dataCpy.type = Type[data.type];
        }

        if (data.transactionStatus) {
            if (!TransactionStatus[data.transactionStatus])
                throw Error(`${data.transactionStatus} is not a valid transaction status. This problem is related to the database, please contact an administrator.`);

            dataCpy.transaction_status = TransactionStatus[data.transactionStatus];
            delete dataCpy.transactionStatus;
        }

        if (data.publishStatus) {
            if (!PublishStatus[data.publishStatus])
                throw Error(`${data.publishStatus} is not a valid publish status. This problem is related to the database, please contact an administrator.`);

            dataCpy.publish_status = PublishStatus[dataCpy.publishStatus];
            delete dataCpy.publishStatus;
        }

        if (data.id) {
            dataCpy._id = data.id;
            delete dataCpy.id;
        }

        return dataCpy;
    }

    /**
     * Formats the data to match the GraphQL definition
     * @param {any} ads database ad array
     */
    prepareDataForGql(ads) {
        const formatedAds = new Array();

        ads.forEach(ad => {
            formatedAds.push({
                id: ad._id,
                title: ad.title,
                description: ad.description,
                price: ad.price,
                type: getKeyByValue(Type, ad.type),
                transactionStatus: getKeyByValue(TransactionStatus, ad.transaction_status),
                publishStatus: getKeyByValue(PublishStatus, ad.publish_status),
            });
        });

        return formatedAds;
    }
}

module.exports = AdDataService;