module.exports = {
    databaseAddress: 'mongodb://127.0.0.1:27017/<%=projectName%>Dev',
    baseEmail:'@<%=projectName%>.com',
    port: 3333,
    baseUrl: '/v1/<%=projectName%>/',
    secretOrkeyApp: '<%=projectName%>-user' //生成token时使用的密钥
} 