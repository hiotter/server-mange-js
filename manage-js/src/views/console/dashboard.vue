<template>
  <div class="container-normal container-new">
    <count-cards :items="counts" />
  </div>
</template>

<script>
import countCards from "@/components/dashboard/count-cards.vue";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import api from "@/api/console.js";
import { mapState } from "vuex";
export default {
  components: {
    countCards,
  },
  data() {
    return {
      counts: [
        {
          icon: require("../../assets/icons/未处理投诉.png"),
          theme: "filled",
          bgColor: "#282c37",
          title: "我的员工",
          value: 999,
        },
        // {
        //   icon: require("../../assets/icons/未处理投诉.png"),
        //   theme: "outlined",
        //   bgColor: "#9baec8",
        //   title: "我的用户",
        //   value: 999,
        // }
      ],
      dateQuery: this.$route.date,
    };
  },
  watch: {
    $route: {
      handler() {
        this.dateQuery = this.$route.query.date;
        this.__queryUsers();
      },
      deep: true,
    },
  },
  computed: {
    columns() {
      return [
        {
          title: "我的客户",
          key: "nickname",
          dataIndex: "nickname",
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
          filteredValue: this.filters.nickname,
          width: 160,
          align: "center",
        },
        {
          title: "客户微信",
          key: "wxId",
          dataIndex: "wxId",
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
          filteredValue: this.filters.wxId,
          align: "center",
        },
        {
          title: "客户性别",
          key: "gender",
          dataIndex: "gender",
          align: "center",
        },
        {
          title: "负责员工",
          key: "staff",
          dataIndex: "staff",
          scopedSlots: {
            customRender: "staff",
          },
          align: "center",
        },
        {
          title: "客户头像",
          key: "avatar",
          dataIndex: "avatar",
          scopedSlots: {
            customRender: "avatar",
          },
          align: "center",
        },
        {
          title: "用户状态",
          key: "status",
          dataIndex: "status",
          align: "center",
        },
        {
          title: "用户进程",
          key: "progress",
          dataIndex: "progress",
          align: "center",
        },
        {
          title: "预约记录（次）",
          key: "appointment",
          dataIndex: "appointment",
          align: "center",
        },
        {
          title: "跟进记录（次）",
          key: "followRecord",
          dataIndex: "followRecord",
          align: "center",
        },
        {
          title: "上次会面",
          key: "lastAppoinment",
          dataIndex: "lastAppoinment",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
          width: 100,
          align: "center",
        },
      ];
    },
    ...mapState("permission", ["userInfo"]),
  },
  created() {
    this.refresh();
  },
  methods: {
    async __initDashboard() {
      try {
        let { counts } = await api.getDashboard();
        for (let i = 0; i < counts.length; i++) {
          this.counts[i].value = counts[i];
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    refresh() {
      this.__initDashboard();
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 1250px) {
  .container-new {
    min-width: 1010px;
    display: inline-block;
  }
}

.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.ant-upload img {
  width: 104px;
  height: 104px;
}
</style>
