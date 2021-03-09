// 服务层 处理业务逻辑 调用 db/models/....
const Role = require('../../db/models/role')
const Staff = require('../../db/models/staff')

module.exports = {
    addRole: async (payload) => {
        const ifExist = await Role.findOne({ name: payload.name });
        if (ifExist) {
            let err = new Error('角色名被占用,请重新设置')
            err.code = 409
            throw err
        }
        let res = await Role.create(payload)
        return {
            msg: '角色新增成功',
            data: res
        }
    },
    deleteRole: async (id) => {
        let findResult = await Staff.find({ role: id })
        if (findResult.length > 0) {
            const err = new Error('该角色下存在员工,不可删除,请重新确认')
            err.code = 409
            throw err
        }
        let res = await Role.findByIdAndDelete(id)
        return { msg: "角色删除成功" }
    },
    editRole: async (id, payload) => {
        let ifExist = await Role.findOne({ name: payload.name, _id: { $ne: id } })
        if (ifExist) {
            const err = new Error('角色名称已被占用')
            err.code = 409
            throw err
        }
        let uploadResult = await Role.findByIdAndUpdate({ _id: id }, payload, { new: true })
        return {
            msg: '角色更新成功',
            data: uploadResult
        }
    },
    roleList: async () => {
        const roles = await Role.find()
        if (roles.length == 0) {
            const err = new Error('角色列表为空')
            err.code = 409
            throw err
        }
        let res = await Promise.all(roles.map(async item => {
            const staffsCount = await Staff.find({ role: item._id }).countDocuments()
            item = { ...item._doc, staffsCount }
            return item
        }))

        return {
            msg: '角色列表查询成功',
            data: res
        }
    },
    roleInfo: async (id) => {
        let findResult = await Role.findOne({ _id: id })

        return {
            msg: '角色查询成功',
            data: findResult
        }
    }
}
