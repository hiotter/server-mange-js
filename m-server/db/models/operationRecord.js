const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const operatorRecordSchema = mongoose.Schema({
    module: { type: String },
    type: { type: String },
    contents: { type: String },
    staff: { type: ObjectId, ref: 'Staff' },
    time: { type: Date, default: Date.now },
})

module.exports = mongoose.model('OperatorRecord', operatorRecordSchema)
