const mongoose = require('mongoose')

// 员工
const staffSchema = mongoose.Schema({
    name: { type: String }, //员工名称
    username: { type: String }, //员工账户
    password: { type: String }, //密码
    nickname: { type: String }, //昵称
    avatar: { type: String, default: '' }, //头像
    role: {
        type: mongoose.SchemaTypes.ObjectId, //角色
        ref: 'Role',
        index: true
    }
})

module.exports = mongoose.model('Staff', staffSchema)