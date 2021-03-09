const mongoose = require('mongoose')

// 角色
const roleSchema = mongoose.Schema({
    name: { type: String, index: true }, //角色名
    desc: { type: String }, //角色描述
    routesAuths: [{ type: String }], //路由权限
    buttonsAuths: [{ type: String }], //按钮权限
    contentsAuths: [{ type: String }],  //内容权限
    othersAuths: [{ type: String }]  //其他权限
})

module.exports = mongoose.model('Role', roleSchema)