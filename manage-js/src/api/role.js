import request from './index.js' 
export default {
	getRoles:async()=>{
		return await request.get('/roles')
	},
	createRole:async(payload)=>{
		return await request.post('/roles',payload)
	},
	updateRole:async(id,payload)=>{
		return await request.put(`/roles/${id}`,payload)
	},
	deleteRole:async(id)=>{
		return await request.delete(`/roles/${id}`)
	}
}