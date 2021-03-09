const Services = require('./services')

module.exports = {
    getDashboard: async (ctx) => {
        let token = ctx.request.header.authorization
        let res = await Services.getDashboard(token)
        ctx.body = res
    },
    
}