// 路由接口
const Router = require('koa-router')
const Key = require('../../configuration/env')()
const v1 = new Router({ prefix: `${Key.baseUrl}staffs` }) // 业务一级路由用复数
const Controllers = require('./controllers')

v1.post('/', Controllers.addStaff)
v1.delete('/:id', Controllers.deleteStaff)
v1.put('/:id', Controllers.editStaff)
v1.patch('/:id', Controllers.pacthPassword)
v1.get('/', Controllers.staffList)
v1.get('/staffInfo', Controllers.staffInfo)
v1.post('/login', Controllers.login)
v1.get('/searchByName', Controllers.searchByName)
v1.get('/qCode', Controllers.qCode)

module.exports = [v1]