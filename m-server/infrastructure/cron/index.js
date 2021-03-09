const schedule = require('node-schedule')
const AutoCheckInTable = require('./autoCheckInTable')
module.exports = {
    processing: async () => {
        // schedule.scheduleJob('0 0 0 * * *', async () => {
        //     //每日零点计算用户签到
        //     await AutoCheckInTable.toggleCheck()
        // })
    }
}