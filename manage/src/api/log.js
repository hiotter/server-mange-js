import request from './index.js'
export default {
	getLoginRecords: async (filters, current, pageSize) => {
		let url = `/logs/login?crtPage=${current}&pageSize=${pageSize}`
		if (filters.username.length > 0) {
			url = `/logs/login?query-username=${filters.username[0]}&crtPage=${current}&pageSize=${pageSize}`
		}
		if (filters.name.length > 0) {
			url = `/logs/login?query-name=${filters.name[0]}&crtPage=${current}&pageSize=${pageSize}`
		}
		return await request.get(url)
	},
	getOperationRecords: async (filters, current, pageSize) => {
		let url = `/logs/operation?current=${current}&page-size=${pageSize}`
		if (filters.module.length > 0) {
			url = `/logs/operation?query-module=${filters.module[0]}&current=${current}&page-size=${pageSize}`
		}

		if (filters.customerName.length > 0) {
			url = `/logs/operation?query-customerName=${filters.customerName[0]}&current=${current}&page-size=${pageSize}`
		}
		if (filters.type.length > 0) {
			url = `/logs/operation?query-type=${filters.type[0]}&current=${current}&page-size=${pageSize}`
		}
		if (filters.contents.length > 0) {
			url = `/logs/operation?query-contents=${filters.contents[0]}&current=${current}&page-size=${pageSize}`
		}
		if (filters.operator.length > 0) {
			url = `/logs/operation?query-operator=${filters.operator[0]}&current=${current}&page-size=${pageSize}`
		}
		return await request.get(url)
	},
	createOperation: async (payload) => {
		return await request.post('/logs/operation', payload)
	}
}