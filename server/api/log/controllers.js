const Services = require('./services')

module.exports = {
    getLoginRecord: async (ctx) => {
        let query = {}
        if (ctx.query['query-name']) {
            query.name = { $regex: ctx.query['query-name'], $options: 'i' }
        }
        if (ctx.query['query-username']) {
            query.username = { $regex: ctx.query['query-username'], $options: 'i' }
        }
        ctx.query['crtPage'] = ctx.query['crtPage'] ? ctx.query['crtPage'] : '1'
        ctx.query['pageSize'] = ctx.query['pageSize'] ? ctx.query['pageSize'] : '10'
        let skip = (parseInt(ctx.query['crtPage']) - 1) * parseInt(ctx.query['pageSize'])
        let limit = parseInt(ctx.query['pageSize'])
        let res = await Services.getLoginRecord(query, skip, limit)
        ctx.body = res
    },
    getOperationRecord: async (ctx) => {
        let query = {}
        if (ctx.query['query-module']) {
            query["module"] = { $regex: ctx.query['query-module'], $options: 'i' }
        }
        if (ctx.query['query-type']) {
            query["type"] = { $in: ctx.query['query-type'].split(',') }
        }
        if (ctx.query['query-contents']) {
            query["contents"] = { $regex: ctx.query['query-contents'], $options: 'i' }
        }
        if (ctx.query['query-operator']) {
            query.staffPop = true
            query.staffKeyword = ctx.query['query-operator']
        }
        let skip = (parseInt(ctx.query['current']) - 1) * parseInt(ctx.query['page-size'])
        let limit = parseInt(ctx.query['page-size'])
        let res = await Services.getOperationRecord(query, skip, limit)
        ctx.body = res
    },
    createOperation: async (ctx) => {
        let payload = { ...ctx.request.body }
        await Services.createOperation(payload)
        ctx.status = 201
        ctx.body = undefined
    },
}