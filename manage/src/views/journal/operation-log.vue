<template>
  <div class="container-normal container-new">
    <div class="d-flex a-center mb-2">
      <a-button type="primary" class="ml-auto" @click="refresh"
        >刷新表格</a-button
      >
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="records"
      rowKey="_id"
      :pagination="pagination"
      @change="handleChange"
    >
      <!-- 自定义搜索filter -->
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        class="custom-filter-dropdown"
      >
        <a-input
          v-ant-ref="(c) => (searchInput = c)"
          :placeholder="`搜索 ${column.title}`"
          :value="selectedKeys[0]"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="() => handleSearch(selectedKeys, confirm)"
          style="width: 188px; margin-bottom: 8px; display: block"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm)"
          icon="search"
          size="small"
          style="width: 100%; margin-right: 8px"
          >Search</a-button
        >
        <!-- <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">Reset</a-button> -->
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#30A679' : undefined }"
      />
      <template slot="contents" slot-scope="record">
        <div>
          <div>{{ record.contents }}</div>
        </div>
      </template>
      <template slot="time" slot-scope="record">
        <a-tag color="green">{{ record.time | toDate }}</a-tag>
      </template>
    </a-table>
  </div>
</template>

<script>
import api from "@/api/log.js";
import dayjs from "dayjs";
export default {
  name: "operation-record",
  data() {
    return {
      // 集中控制过滤
      filters: {
        module: [],
        orderCode: [],
        customerName: [],
        type: [],
        contents: [],
        operator: [],
      },
      pagination: {
        current: 1,
        pageSize: 10,
      },
      records: [],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "模块名称",
          key: "module",
          dataIndex: "module",
          filters: [
            {
              text: "会员管理",
              value: "会员管理",
            },
            {
              text: "用户认证",
              value: "用户认证",
            },
            {
              text: "单身社区",
              value: "单身社区",
            },
            {
              text: "虚拟币管理",
              value: "虚拟币管理",
            },
          ],
          filteredValue: this.filters.module,
          width: 110,
        },
        {
          title: "操作类型",
          key: "type",
          dataIndex: "type",
          align: "center",
          filters: [
            {
              text: "创建",
              value: "创建",
            },
            {
              text: "修改",
              value: "修改",
            },
            {
              text: "删除",
              value: "删除",
            },
          ],
          filteredValue: this.filters.type,
          width: 110,
        },
        {
          title: "内容",
          key: "contents",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "contents",
          },
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
                this.initFilters();
              });
            }
          },
          filteredValue: this.filters.contents,
        },
        {
          title: "操作者",
          key: "operator",
          dataIndex: "operator",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
                this.initFilters();
              });
            }
          },
          filteredValue: this.filters.operator,
          width: 110,
        },
        {
          title: "时间",
          key: "time",
          scopedSlots: {
            customRender: "time",
          },
          align: "center",
          width: 170,
        },
      ];
    },
  },
  filters: {
    toDate(value) {
      return dayjs(value).format("YYYY年MM月DD日 HH:mm:ss");
    },
    toDay(value) {
      return dayjs(value).format("YYYY.MM.DD");
    },
  },
  activated() {
    this.__queryRecords();
  },
  methods: {
    refresh() {
      this.initFilters();
      this.pagination = {
        current: 1,
        pageSize: 10,
      };
      this.__queryRecords();
    },
    initFilters() {
      this.filters = {
        module: [],
        customerName: [],
        type: [],
        contents: [],
        operator: [],
      };
    },
    handleChange(pagination, filters) {
      this.filters = filters;
      // 处理分页
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.__queryRecords();
    },
    handleSearch(selectedKeys, confirm) {
      confirm();
    },
    handleReset(clearFilters) {
      clearFilters();
    },
    async __queryRecords() {
      try {
        let { current, pageSize } = this.pagination;
        let res = await api.getOperationRecords(
          this.filters,
          current,
          pageSize
        );
        console.log(99999, this.records);
        this.records = [...res.data];
        let total = res.total;
        this.pagination = { ...this.pagination, total };
      } catch (err) {
        this.records = [];
        this.pagination = { ...this.pagination, total: 0 };
        this.$message.error(err.message);
      }
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 1650px) {
  .container-new {
    min-width: 1410px;
    display: inline-block;
  }
}

.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
