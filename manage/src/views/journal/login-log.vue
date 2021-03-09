<template>
	<div class="container-normal container-new">
		<div class="d-flex a-center mb-2">
			<a-button type="primary" class="ml-auto" @click="refresh">刷新表格</a-button>
		</div>
		<a-table bordered :columns="columns" :dataSource="records" rowKey="time" :pagination="pagination" @change="handleChange">
			<!-- 自定义搜索filter -->
			<div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class='custom-filter-dropdown'>
				<a-input v-ant-ref="c => searchInput = c" :placeholder="`搜索 ${column.title}`" :value="selectedKeys[0]" @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
				 @pressEnter="() => handleSearch(selectedKeys, confirm)" style="width: 188px; margin-bottom: 8px; display: block;" />
				<a-button type='primary' @click="() => handleSearch(selectedKeys, confirm)" icon="search" size="small" style="width: 100%; margin-right: 8px">Search</a-button>
				<!-- <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">Reset</a-button> -->
			</div>
			<a-icon slot="filterIcon" slot-scope="filtered" type='search' :style="{ color: filtered ? '#30A679' : undefined }" />
			<template slot="username" slot-scope="record">
				{{record.username}}
			</template>
			<template slot="name" slot-scope="record">
				{{record.name}}
			</template>
			<template slot="time" slot-scope="record">
				<a-tag color="green" v-if="record.status!='fail'">{{record.time | toDate}}</a-tag>
				<a-tag color="red" v-else>{{record.time | toDate}} {{record.error}}</a-tag>
			</template>
		</a-table>
	</div>
</template>

<script>
	import api from "@/api/log.js"
	// import dayjs from 'dayjs';
	export default {
		name:'login-record',
		data() {
			return {
				// 集中控制过滤
				filters: {
					username:[],
					name:[]
				},
				pagination: {
					current: 1,
					pageSize: 10
				},
				records: []
			}
		},
		computed: {
			columns() {
				return [
					{
						title: '用户名',
						key: 'username',
						scopedSlots: {
							filterDropdown: 'filterDropdown',
							customRender: 'username',
							filterIcon: 'filterIcon'
						},
						onFilterDropdownVisibleChange: (visible) => {
							if (visible) {
								setTimeout(() => {
									this.searchInput.focus()
									this.initFilters()
								})
							}
						},
						filteredValue: this.filters.username
					},
					{
						title: '姓名',
						key: 'name',
						scopedSlots: {
							filterDropdown: 'filterDropdown',
							customRender: 'name',
							filterIcon: 'filterIcon'
						},
						onFilterDropdownVisibleChange: (visible) => {
							if (visible) {
								setTimeout(() => {
									this.searchInput.focus()
									this.initFilters()
								})
							}
						},
						filteredValue: this.filters.name
					},
					{
						title: 'IP 地址',
						key: 'ip',
						dataIndex: 'ip',
						align: 'center'
					},
					{
						title: '登录时间',
						key: 'time',
						scopedSlots: {
							customRender: 'time'
						},
						align: 'center'
					}
				]
			}
		},
		activated() {
			this.__queryRecords()
		},
		methods: {
			refresh() {
				this.initFilters()
				this.pagination = {
					current: 1,
					pageSize: 10
				}
				this.__queryRecords()
			},
			initFilters() {
				this.filters = {
					username: [],
					name: []
				}
			},
			handleChange(pagination, filters) {
				this.filters = filters
				// 处理分页
				const pager = { ...this.pagination
				}
				pager.current = pagination.current
				this.pagination = pager
				this.__queryRecords()
			},
			handleSearch(selectedKeys, confirm) {
				confirm()
			},
			handleReset(clearFilters) {
				clearFilters()
			},
			async __queryRecords() {
				try {
					let {
						current,
						pageSize
					} = this.pagination
					let res = await api.getLoginRecords(this.filters, current, pageSize)
					let total = res.total
					this.records = [...res.data]
					this.pagination = { ...this.pagination,
						total
					}
				} catch (err) {
					this.records = []
					this.pagination = { ...this.pagination,
						total:0
					}
					this.$message.error(err.message)
				}
			}
		}
	}
</script>

<style scoped>
	@media screen and (max-width:1650px) {
		.container-new {
			min-width: 1410px;
			display: inline-block;
		}
	}

	.custom-filter-dropdown {
		padding: 8px;
		border-radius: 4px;
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
	}
</style>
