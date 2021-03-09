// const mongoose = require('mongoose')
// const CheckInTable = require('../../db/models/checkInTable')
// const CheckInRecord = require('../../db/models/checkInRecord')
// const CheckInBonus = require('../../db/models/checkInBonus')
// const db = require('../../session/index')
// const connection = mongoose.connection
// let ObjectID = require('mongodb').ObjectId;

// module.exports = {
//     toggleCheck: async () => {
//         //每日零点刷新用户签到，并将当日用户签到应获得的树苗值更新
//         let checkInTable = await CheckInTable.find()
//         //开启事务
//         let session = await db.getSession()
//         try {
//             let toggleCheckRes = await Promise.all(checkInTable.map(async item => {
//                 let newRecord = await CheckInRecord.find({ userId: item.userId }).sort({ createdAt: -1 })
//                 let checkInBonus = await CheckInBonus.findOne()
//                 let bonusArr = Object.values(checkInBonus._doc).slice(0, 7)
//                 console.log(bonusArr)
//                 //用户最近的一次签到记录
//                 let date = newRecord[0].createdAt
//                 //当日零点的时间戳
//                 let nowDate = new Date(new Date().toLocaleDateString()).getTime()
//                 //前一日零点的时间戳
//                 let todayDate = nowDate - 24 * 60 * 60 * 1000

//                 if (date > todayDate) {
//                     //用户最近的一次签到时间为昨日,连续签到,用户签到奖励递增
//                     console.log('连续签到', newRecord[0])
//                     //更新用户签到奖励及状态
//                     let checkInTableRes = await connection.collection('checkintables').updateOne(
//                         { userId: ObjectID(item.userId) },
//                         { $set: { ifCheck: false, current: index } },
//                         { session }
//                     );
//                     return checkInTableRes.result
//                 } else {
//                     // 非连续签到,用户签到奖励归零
//                     console.log('非连续签到')
//                     let checkInTableRes = await connection.collection('checkintables').updateOne(
//                         { userId: ObjectID(item.userId) },
//                         { $set: { ifCheck: false, current: 1 } },
//                         { session }
//                     );
//                     return checkInTableRes.result
//                 }
//             }))
//             //提交事务
//             await session.commitTransaction();
//         } catch (error) {
//             console.log(error)
//             const res = await session.abortTransaction();
//             const err = new Error('服务异常,请稍后重试')
//             err.code = 409
//             throw err
//         } finally {
//             await session.endSession();
//         }
//     }
// }