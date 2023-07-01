import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const schema2 = new Schema({
    groupName: { type: String, unique: true, required: true },
    groupMembers: { type: String, required: true }

});


schema2.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Groups',schema2);