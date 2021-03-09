// 服务层 处理业务逻辑 调用 db/models/....
const Staff = require('../../db/models/staff')
const Key = require('../../configuration/env')()
const jwt = require('jsonwebtoken');

module.exports = {
    getDashboard: async (token) => {
        console.log(token)
        let decoded = jwt.verify(token, Key.secretOrkeyApp)
        //我的员工
        let myStaffsNum = await Staff.countDocuments()
       
        return {
            msg: '仪表盘数据查询成功',
            counts: [
                myStaffsNum, //所有用户
             
            ],
        }
    }
}
