// 路由接口
const Router = require('koa-router')
const Key = require('../../configuration/env')()
const v1 = new Router({ prefix: `${Key.baseUrl}logs` }) // 业务一级路由用复数
const Controllers = require('./controllers')

v1.get('/login',Controllers.getLoginRecord)
v1.get('/operation',Controllers.getOperationRecord)
v1.post('/operation',Controllers.createOperation)

module.exports = [v1]