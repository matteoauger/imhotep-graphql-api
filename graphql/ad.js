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

    async insertAd(data) {
        const params = this.adDataService.prepareDataForDb(data);
        const newAd = await this.adService.insert(params);
        const result = this.adDataService.prepareDataForGql([ newAd ]);

        return result[0];
    }

    async updateAd(data) {
        const params = this.adDataService.prepareDataForDb(data);
        const id = params._id;
        delete params._id;

        const updatedAd = await this.adService.update(id, params);

        const result = this.adDataService.prepareDataForGql([updatedAd]);
        return result[0];
    }

    async deleteAd({ id }) {
        const response = await this.adService.delete(id);
        return response.ok  === 1 && response.deletedCount > 0;
    }
}

// reading graphQL ad schema from gql file
const schemaPath = path.join(__dirname, 'gql-schemas', 'Ad.gql');
const schemaTxt = fs.readFileSync(schemaPath,  {encoding: 'utf-8'});

module.exports = {
    schema: buildSchema(schemaTxt),
    root: new AdQueryHandler()
}