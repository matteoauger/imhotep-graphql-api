const AdSchema = require('../models/ad');
const Ad = AdSchema.Ad;
const Question = AdSchema.Question;

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
        return Ad.findOneAndUpdate({_id: id}, data, { useFindAndModify: true, returnNewDocument: true });
    }

    delete(id) {
        return Ad.deleteOne({ _id: id });
    }

    updateQuestion(id, data) {
        return Question.findById(id);
        //return Question.findOneAndUpdate({_id: id }, data, { useFindAndModify: true, returnNewDocument: true });
    }

    deleteQuestion(id) {
        return Question.deleteOne({_id: id});
    }
}

module.exports = AdService;