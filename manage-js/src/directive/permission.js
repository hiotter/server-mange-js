import Vue from 'vue'
import store from '@/store'
const contentsAuthsMap = [{
	title: '全局参数',
	key: '0',
	children: [
		// {
		// 	title: '运费相关',
		// 	key: '0-0'
		// }
	]
},{
	title: '仪表板',
	key: '1',
	children: [{
			title: '我的用户',
			key: '1-0'
		},
	]
}]

const buttonsAuthsMap = [{
		title: '全局参数',
		key: '0',
		children: []
	},
	{
		title: '员工管理',
		key: '1',
		children: [
			{
				title: '编辑员工',
				key: '1-0'
			},
			{
				title: '重置密码',
				key: '1-1'
			},
			{
				title: '删除员工',
				key: '1-2'
			},
		]
	},

]

const othersAuthsMap = ["其他权限示例"]

const permission = Vue.directive('permission', {
	inserted: (el, binding) => {
		let type = binding.arg === 'btn' ? 'buttonsAuths' : 'contentsAuths'
		if (!store.state.permission.userInfo.role[type].includes(binding.value) && store.state.permission.userInfo.role.name !==
			'管理员') {
			el.parentNode.removeChild(el)
		}
	}
})

export {
	buttonsAuthsMap,
	contentsAuthsMap,
	othersAuthsMap,
	permission
}
