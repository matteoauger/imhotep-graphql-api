const AdSchema = require('../models/ad');
const Ad = AdSchema.Ad;

/**
 * Service fetching and modifying data from the ad database.
 */
class AdService {
    getAd(data) {
        return Ad.find(data);
    }
}

module.exports = AdService;