var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var countrySchema = new Schema({
    name: {type: String, unique: true, isRequired:true}
})

module.exports = mongoose.model('Country', countrySchema);
