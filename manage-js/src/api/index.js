import axios from 'axios'

const instance = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL,
	timeout: 30 * 60 * 1000
})

instance.interceptors.response.use(function (response) {
	return response.data
}, function (error) {
	let info = {
		status: '',
		message: ''
	}
	if (!error.response) {
		info.message = '网络连接超时'
	} else {
		info.status = error.response.status
		info.message = error.response.data.error
		if (info.status === 500) {
			info.message = '服务器内部错误'
		}
	}
	return Promise.reject(info)
})

export default instance