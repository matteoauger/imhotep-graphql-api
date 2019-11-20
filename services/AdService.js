const AdSchema = require('../models/Ad');
const Ad = AdSchema.Ad;

class AdService {
    getAd(data) {
        return Ad.find(data);
    }
}

module.exports = AdService;