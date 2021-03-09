// 路由接口
const Router = require('koa-router')
const Key = require('../../configuration/env')()
const v1 = new Router({ prefix: `${Key.baseUrl}consoles` }) // 业务一级路由用复数
const Controllers = require('./controllers')

v1.get('/dashboard',Controllers.getDashboard)
module.exports = [v1]