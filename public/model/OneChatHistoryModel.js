import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema4 = new Schema({
    // userEmail: { type: String, unique: true, required: true },
    users: {
        user1: { type: String },
        user2: { type: String }
    },
    message: [{
        username: { type: String },
        message: { type: String }
    }],

});


schema4.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});



module.exports = mongoose.model('OneToOneChat', schema4);