// 服务层 处理业务逻辑 调用 db/models/....
const LoginRecord = require('../../db/models/loginRecord')
const OperatorRecord = require('../../db/models/operationRecord')
const Staff = require('../../db/models/staff')

module.exports = {
    getLoginRecord: async (query, skip, limit) => {
        let total = await LoginRecord.countDocuments(query)
        if (total <= 0) {
            const err = new Error('登录日志为空')
            err.code = 404
            throw err
        }
        let payload = await LoginRecord.find(query).sort({ _id: -1 }).skip(skip).limit(limit)
        return {
            msg: '登录日志列表查询成功',
            data: payload,
            total
        }
    },
    getOperationRecord: async (query, skip, limit) => {
        let { staffPop, staffKeyword } = query

        if (staffPop) {
            let staffs = await Staff.find({
                name: { $regex: staffKeyword, $options: 'i' }
            }).select('_id')
            query.staff = { $in: staffs.map(s => s._id) } // [_id1,_id2...]
            delete query.staffPop
            delete query.staffKeyword
        }

        let total = 0
        let payload = []

        let basicStages = [{
            $lookup: {
                from: "staffs",
                localField: "staff",
                foreignField: "_id",
                as: "staffInfo"
            }
        },
        {
            $unwind: {
                path: "$staffInfo",
                preserveNullAndEmptyArrays: true
            }
        }]

        total = await OperatorRecord.aggregate([{ $match: query }, { $count: "total" }])
        if (total.length === 0) {
            const err = new Error('日志列表为空')
            err.code = 404
            throw err
        }
        total = total[0].total

        payload = await OperatorRecord.aggregate([
            { $match: query },
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            ...basicStages,
            {
                $project: {
                    module: 1,
                    contents: 1,
                    type: 1,
                    time: 1,
                    operator: "$staffInfo.name"
                }
            }
        ])
        return {
            msg: '操作日志列表查询成功',
            data: payload,
            total
        }
    },
    createOperation: async (payload) => {
        await OperatorRecord.create(payload)
    },
}