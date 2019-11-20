const fs = require('fs');
const { buildSchema } = require('graphql');
const AdService = require('../services/AdService');
const AdDataService = require('../services/AdDataService');
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
        const params = this.adDataService.prepareData(data);
        const ads = await this.adService.getAd(params);

        return this.adDataService.outputData(ads);
    }

    adByTypes(types) {
        console.log(data);
        return {};
        //return AdService.getByType(types);
    }

    adByStatuses(transactionStatuses) {
        console.log(data);
        return {};
        //return AdService.getByStatuses(transactionStatuses);
    }

    adCheaperThan(price, inclusive) {
        console.log(data);
        return {};
        //return AdService.getAdCheaperThan(price, inclusive)
    }
    
    adMoreExpensiveThan(price, inclusive) {
        console.log(data);
        return {};
        //return AdService.getAdMoreEspensiveThan(price, inclusive)
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