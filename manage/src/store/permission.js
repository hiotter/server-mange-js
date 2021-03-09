import timeLocalStorage from 'time-localstorage'
import api from '@/api/staff.js'
const initState = () => {
	return {
		token:null,
		addRoutesDone:false,
		menu:[],
		userInfo:null
	}
}

export default {
	namespaced:true,
	state:initState(),
	getters:{
		
	},
	actions:{
		__login:({commit},{username,password})=>{
			return new Promise(async (resolve,reject)=>{
				try{
					let token = await api.login(username,password)
					commit('STORE_TOKEN',token)
					timeLocalStorage.set('token',token,false)
					resolve('login success')
				}catch(err){
					reject(err)
				}
			})
		},
		__getUserInfo:({commit,state})=>{
			return new Promise(async(resolve,reject)=>{
				try{
					let staff = await api.getStaff()
					commit('STORE_USER_INFO',staff)
					resolve({role:staff.role.name,routesAuths:staff.role.routesAuths})
				}catch(err){
					reject(err)
				}
			})
		}
	},
	mutations:{
		CLEAR_PERMISSION:(state)=>{
			timeLocalStorage.remove('token')
			Object.assign(state,initState())
		},
		STORE_TOKEN:(state,payload)=>{
			state.token = payload
		},
		STORE_USER_INFO:(state,payload)=>{
			state.userInfo = payload
		},
		SET_ADD_ROUTES_DONE:(state)=>{
			state.addRoutesDone = true
		},
		STORE_MENU:(state,payload)=>{
			state.menu = payload
		}
	}
}