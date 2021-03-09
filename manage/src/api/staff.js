import request from './index.js'
import store from '@/store'
export default {
	login: async (username, password) => {
		return await request.post('/staffs/login', { username, password })
	},
	getRoles: async () => {
		return await request.get('/roles')
	},
	createStaff: async (payload) => {
		return await request.post('/staffs', payload)
	},
	deleteStaff: async (id) => {
		return await request.delete(`/staffs/${id}`)
	},
	updateStaff: async (id, payload) => {
		return await request.put(`/staffs/${id}`, payload)
	},
	getStaff: async () => {
		request.defaults.headers.common['authorization'] = store.state.permission.token
		return await request.get('/staffs/staffInfo')
	},
	getStaffs: async (filters, current, pageSize) => {
		let url = `/staffs?crtPage=${current}&pageSize=${pageSize}`
		if (filters.name.length > 0) {
			url = `/staffs?query-name=${filters.name[0]}&crtPage=${current}&pageSize=${pageSize}`
		}
		if (filters.role.length > 0) {
			url = `/staffs?query-role=${filters.role}&crtPage=${current}&pageSize=${pageSize}`
		}
		return await request.get(url)
	},
	resetPassword: async (id, password) => {
		return await request.patch(`/staffs/${id}`, { password })
	}
}