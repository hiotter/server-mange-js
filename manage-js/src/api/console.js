import request from './index.js'
export default {
	//仪表盘
	getDashboard: async () => {
		return await request.get('/consoles/dashboard')
	}
}