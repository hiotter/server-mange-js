// 路由接口
const Router = require('koa-router')
const Key = require('../../configuration/env')()
const v1 = new Router({ prefix: `${Key.baseUrl}roles` }) // 业务一级路由用复数
const Controllers = require('./controllers')

v1.post('/', Controllers.addRole)
v1.delete('/:id', Controllers.deleteRole)
v1.put('/:id', Controllers.editRole)
v1.get('/', Controllers.roleList)
v1.get('/roleInfo', Controllers.roleInfo)

module.exports = [v1]