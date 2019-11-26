const fs = require('fs');
const { buildSchema } = require('graphql');
const AdService = require('../services/ad-service');
const AdDataService = require('../services/ad-data-service');
const path = require('path');


/**
 * Ad Query handler
 */
class AdQueryHandler {
    constructor() {
        this.adService = new AdService();
        this.adDataService = new AdDataService();
    }

    async ad(data) {
        const params = this.adDataService.prepareDataForDb(data);
        const ads = await this.adService.getAd(params);

        return this.adDataService.prepareDataForGql(ads);
    }

    async adCheaperThan({ price, inclusive }) {
        const ads = await this.adService.getAdsCheaperThan(price, inclusive)
        return this.adDataService.prepareDataForGql(ads);
    }
    
    async adMoreExpensiveThan({ price, inclusive }) {
        const ads = await this.adService.getAdsMoreExpensiveThan(price, inclusive)
        return this.adDataService.prepareDataForGql(ads);
    }
}

// reading graphQL ad schema from gql file
const schemaPath = path.join(__dirname, 'gql-schemas', 'Ad.gql');
const schemaTxt = fs.readFileSync(schemaPath,  {encoding: 'utf-8'});

// Construct a schema, using GraphQL schema language
var schema = buildSchema(schemaTxt);

module.exports = {
    schema: schema, 
    root: new AdQueryHandler()
}