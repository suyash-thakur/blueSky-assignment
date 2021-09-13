var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var emissionSchema = new Schema({
    countryID: { type: Schema.Types.ObjectId, isRequired: true, ref: 'Country' },
    year: { type: Number, isRequired: true },
    value: { type: Number, isRequired: true },
    category: {type: String, isRequired: true}
})

module.exports = mongoose.model('EmissionData', emissionSchema);