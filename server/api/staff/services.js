// 服务层 处理业务逻辑 调用 db/models/....
const Staff = require('../../db/models/staff')
const LoginRecord = require('../../db/models/loginRecord')
const Key = require('../../configuration/env')()
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js')

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

module.exports = {
    addStaff: async (payload) => {
        const findResult = await Staff.find({ username: payload.username });
        if (findResult.length > 0) {
            let err = new Error('用户名被占用,请重新设置')
            err.code = 409
            throw err
        }
        payload.password = CryptoJS.HmacSHA256(payload.password, Key.secretOrkeyApp)
        let staff = await Staff.create(payload)
        return {
            msg: '员工新增成功',
            data: staff
        }
    },
    deleteStaff: async (id) => {
        let res = await Staff.findByIdAndDelete({ _id: id })
        return { msg: "员工删除成功" }
    },
    editStaff: async (id, payload) => {
        let ifExist = await Staff.findOne({ username: payload.username, _id: { $ne: id } })
        if (ifExist) {
            const err = new Error('员工名称已被占用')
            err.code = 409
            throw err
        }

        let uploadResult = await Staff.findByIdAndUpdate({ _id: id }, payload, { new: true })
        return {
            msg: '员工更新成功',
            data: uploadResult
        }
    },
    staffList: async (query, skip, limit) => {
        let total = await Staff.countDocuments(query)
        if (total <= 0) {
            const err = new Error('员工列表为空')
            err.code = 404
            throw err
        }
        let payload = await Staff.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select('-password').populate({ path: 'role', select: 'name' })
        return {
            msg: '员工列表查询成功',
            data: payload,
            total
        }
    },
    staffInfo: async (token) => {
        try {
            let decoded = jwt.verify(token, Key.secretOrkeyApp)
            let findResult = await Staff.findOne({ username: decoded.username }).select('-password').populate({ path: 'role' })
            return findResult
        } catch (error) {
            const err = new Error('登录状态已过期,请重新登录')
            err.code = 409
            throw err
        }
    },
    login: async (username, password, ip) => {
        let findResult = await Staff.findOne({ username }).populate({ path: 'role' });
        let hash = CryptoJS.HmacSHA256(password, Key.secretOrkeyApp)
        if (!findResult) {
            await LoginRecord.create({
                time: new Date(),
                ip,
                status: 'fail',
                error: '用户不存在'
            })
            let err = new Error('没有该用户,请确认')
            err.code = 400
            throw err
        }
        if (hash != findResult.password) {
            await LoginRecord.create({
                time: new Date(),
                ip,
                staff: findResult._id,
                username: findResult.username,
                name: findResult.name,
                status: 'fail',
                error: '密码错误'
            })
            let err = new Error('密码错误')
            err.code = 400
            throw err
        }
        if (findResult) {
            const payload = {
                username,
                password,
                _id: findResult._id
            }
            const token = jwt.sign(payload, Key.secretOrkeyApp, { expiresIn: 3600 * 24 })

            //登录日志
            console.log(ip)
            await LoginRecord.create({
                time: new Date(),
                ip,
                staff: findResult._id,
                username: findResult.username,
                name: findResult.name,
            })
            return token
        }
    },
    pacthPassword: async (id, password) => {
        let hash = CryptoJS.HmacSHA256(password, Key.secretOrkeyApp)
        let uploadResult = await Staff.updateOne({ _id: id }, { password: hash })
        return {
            msg: '员工密码修改成功'
        }
    },
    searchByName: async (name) => {
        let res = await Staff.find({ name })
        console.log(name)
        if (res.length == 0) {
            let err = new Error('没有找到该员工')
            err.code = 400
            throw err
        }
        return res
    }
}
