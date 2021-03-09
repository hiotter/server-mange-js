const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const loginRecordSchema = mongoose.Schema({
    time: Date, //时间
    staff: { type: ObjectId, ref: 'Staff' }, //登录的员工
    ip: String, //登录的ip
    username: { type: String, default: '' },
    name: { type: String, default: '' },
    status: String,
    error: String
})
 
module.exports = mongoose.model('LoginRecord', loginRecordSchema)