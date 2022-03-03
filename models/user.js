var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, minLength: 1, maxLength: 20, required: true },
    password: { type: String, minLength: 5, required: true },
    firstName: { type: String, maxLength: 20 },
    lastName: { type: String, maxLength: 20 },
    status: { type: String, required: true },
    admin: { type: Boolean }
});

UserSchema
.virtual('url')
.get(function() {
    return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);