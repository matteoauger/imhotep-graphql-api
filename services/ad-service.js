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
        const lower = inclusive ? '$lte' : '$lt';
        return Ad.find({ price: { [lower]: price }});
    }

    getAdsMoreExpensiveThan(price, inclusive) {
        const greater = inclusive ? '$gte' : '$gt'; 
        return Ad.find({ price: { [greater] : price }});
    }

    insert(data) {
        return Ad.create(data);
    }

    update(id, data) {
        return Ad.updateOne({_id: id}, data, { new: true });
    }

    delete(id) {
        return Ad.deleteOne({ _id: id });
    }
}

module.exports = AdService;