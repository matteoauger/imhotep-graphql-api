
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
        const formatedAds = ads.map(ad => ({
            id: ad._id,
            title: ad.title,
            description: ad.description,
            price: ad.price,
            type: ad.type,
            transaction_status: ad.transaction_status,
            publish_status: ad.publish_status,
        }));
        return formatedAds;
    }
}

module.exports = AdDataService;