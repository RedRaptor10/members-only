var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { DateTime } = require('luxon');

var PostSchema = new Schema({
    title: { type: String, minLength: 1, maxLength: 100, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date },
    message: { type: String, minLength: 1, required: true }
});

PostSchema
.virtual('url')
.get(function() {
    return '/post/' + this._id;
});

// Virtual for post date formatted
PostSchema
.virtual('dateFormatted')
.get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Post', PostSchema);