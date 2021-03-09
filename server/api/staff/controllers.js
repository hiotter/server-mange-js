const Services = require('./services')

module.exports = {
    addStaff: async (ctx) => {
        let payload = {
            ...ctx.request.body,
            role: ctx.request.body.role._id
        }
        let res = await Services.addStaff(payload)
        ctx.body = res
    },
    deleteStaff: async (ctx) => {
        let id = ctx.params.id
        let res = await Services.deleteStaff(id)
        ctx.body = res
    },
    editStaff: async (ctx) => {
        let id = ctx.params.id
        let payload = {
            ...ctx.request.body
        }

        let res = await Services.editStaff(id, payload)
        ctx.body = res
    },
    staffList: async (ctx) => {
        let query = {
            name: { $ne: '管理员' }
        }
        if (ctx.query['query-name']) {
            query.name = { $regex: ctx.query['query-name'], $options: 'i' }
        }
        if (ctx.query['query-role']) {
            query.role = { $in: ctx.query['query-role'].split(',') }
        }
        console.log(4444, query)
        ctx.query['crtPage'] = ctx.query['crtPage'] ? ctx.query['crtPage'] : '1'
        ctx.query['pageSize'] = ctx.query['pageSize'] ? ctx.query['pageSize'] : '10'
        let skip = (parseInt(ctx.query['crtPage']) - 1) * parseInt(ctx.query['pageSize'])
        let limit = parseInt(ctx.query['pageSize'])
        let res = await Services.staffList(query, skip, limit)
        ctx.body = res
    },
    staffInfo: async (ctx) => {
        let token = ctx.request.header.authorization
        let res = await Services.staffInfo(token)
        ctx.body = res
    },
    login: async (ctx) => {
        let username = ctx.request.body.username
        let password = ctx.request.body.password
        const ip = ctx.headers['x-forwarded-for']
        console.log(username, password, ip)
        let res = await Services.login(username, password, ip)
        ctx.body = res
    },
    pacthPassword: async (ctx) => {
        let id = ctx.params.id
        let password = ctx.request.body.password
        let res = await Services.pacthPassword(id, password)
        ctx.body = res
    },
    searchByName: async (ctx) => {
        let name = ctx.request.query.name
        let res = await Services.searchByName(name)
        ctx.body = res
    },
    qCode: async (ctx) => {
        let res = await Services.qCode()
        ctx.body = res
    }
}