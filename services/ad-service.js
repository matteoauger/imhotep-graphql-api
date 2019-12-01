const AdSchema = require('../models/ad');
const Ad = AdSchema.Ad;

/**
 * Service fetching and modifying data from the ad database.
 */
class AdService {
    getAd(data) {
        return Ad.find(data);
    }

    getAdsCheaperThan(price, inclusive) {
        let query = { price: { $lt : price }};
        if (inclusive)
            query = { price : { $lte: price }};

        return Ad.find(query);
    }

    getAdsMoreExpensiveThan(price, inclusive) {
        let query = { price: { $gt : price }};
        if (inclusive)
            query = { price : { $gte: price }};

        return Ad.find(query);
    }

    insert(data) {
        return Ad.create(data);
    }

    update(id, data) {
        return Ad.findOneAndUpdate({_id: id}, data);
    }

    delete(id) {
        return Ad.deleteOne({ _id: id });
    }
}

module.exports = AdService;