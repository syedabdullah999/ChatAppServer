import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema3 = new Schema({
    // userEmail: { type: String, unique: true, required: true },
    roomName: { type: String },
    message: [{
        username: { type: String },
        message: { type: String }
    }],

});


schema3.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});



module.exports = mongoose.model('History', schema3);