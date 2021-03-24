
const mongoose = require('mongoose')
const Key = require('./configuration/dev')
const databaseAddress = Key.databaseAddress
const CryptoJS = require('crypto-js')
const fs = require('fs')

//连接mongo数据库
mongoose.connect(databaseAddress, {
    useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log(`⚠️  :Connected failed, please check your MongoDB with ${databaseAddress}`)
    } else {
        console.log(`🍟  :Successfully connected to MongoDB at ${databaseAddress}`)
    }
})


const roleSchema = mongoose.Schema({
    name: { type: String, index: true }, //角色名
    desc: { type: String }, //角色描述
    routesAuths: [{ type: String }], //路由权限
    buttonsAuths: [{ type: String }], //按钮权限
    contentsAuths: [{ type: String }],  //内容权限
    othersAuths: [{ type: String }]  //其他权限
})

let Role = mongoose.model('Role', roleSchema)

let newRole = new Role({
    name: '管理员',
    desc: '管理员',
    routesAuths: [],
    buttonsAuths: [],
    contentsAuths: [],
    othersAuths: [],
});

const staffSchema = mongoose.Schema({
    name: { type: String }, //员工名称
    username: { type: String }, //员工账户
    password: { type: String }, //密码
    nickname: { type: String }, //昵称
    avatar: { type: String, default: '' }, //头像
    role: {
        type: mongoose.SchemaTypes.ObjectId, //角色
        ref: 'Role'
    }
})
let Staff = mongoose.model('Staff', staffSchema)

newRole.save().then((res) => {
    let adminStaff = Staff.findOne({ username: `admin${Key.baseEmail}` })
    if (adminStaff) {
        console.log(`数据库${Key.databaseAddress}已存在管理员用户，无需重复创建，请确认`)
        return
    }
    let newStaff = new Staff({
        name: '管理员',
        nickname: '管理员',
        username: `admin${Key.baseEmail}`,
        password: CryptoJS.HmacSHA256('12345678', Key.secretOrkeyApp),
        role: res._id
    });
    newStaff.save().then((res, err) => {
        if (res) {
            console.log('新建用户成功')
            fs.unlinkSync('./makeStaff.js');

            mongoose.connection.close()
            return '新建用户成功'
        } else {
            throw err
        }
    })

})
