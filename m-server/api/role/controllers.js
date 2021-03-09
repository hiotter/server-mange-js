const Services = require('./services')

module.exports = {
    addRole: async (ctx) => {
        let payload = {
            ...ctx.request.body
        }
        if (!Array.isArray(payload.routesAuths) || !Array.isArray(payload.buttonsAuths) || !Array.isArray(payload.contentsAuths) || !Array.isArray(payload.othersAuths)) {
            let err = new Error('权限参数格式错误')
            err.code = 409
            throw err
        }

        let res = await Services.addRole(payload)
        ctx.body = res
    },
    deleteRole: async (ctx) => {
        let id = ctx.params.id
        let res = await Services.deleteRole(id)
        ctx.body = res
    },
    editRole: async (ctx) => {
        let id = ctx.params.id
        let payload = {
            ...ctx.request.body
        }
        if (!Array.isArray(payload.routesAuths) || !Array.isArray(payload.buttonsAuths) || !Array.isArray(payload.contentsAuths) || !Array.isArray(payload.othersAuths)) {
            let err = new Error('权限参数格式错误')
            err.code = 409
            throw err
        }
        let res = await Services.editRole(id, payload)
        ctx.body = res
    },
    roleList: async (ctx) => {
        let res = await Services.roleList()
        ctx.body = res
    },
    roleInfo: async (ctx) => {
        let _id = ctx.request.query._id
        let res = await Services.roleInfo(_id)
        ctx.body = res
    }
}