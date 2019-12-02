const fs = require('fs');
const { buildSchema, GraphQLScalarType } = require('graphql');
const AdService = require('../services/ad-service');
const AdDataService = require('../services/ad-data-service');
const path = require('path');
const gqlDate = require('./date');


/**
 * Ad Query handler
 */
class AdQueryHandler {
    constructor() {
        this.adService = new AdService();
        this.adDataService = new AdDataService();
    }

    Date = new GraphQLScalarType(gqlDate);

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

        await this.adService.update(id, params);
        const updatedAd = await this.adService.getAd({_id: id});

        const result =  this.adDataService.prepareDataForGql( updatedAd );
        return result[0];
    }

    async deleteAd({ id }) {
        const response = await this.adService.delete(id);
        return response.ok  === 1 && response.deletedCount > 0;
    }

    async insertQuestion(data) {
        const adId = data.adId;
        const question = { 
            question: data.question, 
            replies: data.replies || [] 
        };
        
        const ads = await this.adService.getAd({_id: adId});
        const ad = ads[0];

        if (!ad.questions) {
            ad.questions = [];
        }

        ad.questions.push();
        await this.adService.update(adId, ad);

        return question;
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