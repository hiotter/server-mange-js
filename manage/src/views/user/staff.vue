<template>
  <div class="container-normal container-new">
    <div class="d-flex a-center mb-2">
      <a-button type="primary" @click="callCreate">创建员工</a-button>
      <a-button type="primary" class="ml-auto" @click="refresh">刷新表格</a-button>
    </div>
    <a-table bordered :columns="columns" :dataSource="staffs" rowKey="username" :pagination="pagination" @change="handleChange">
      <!-- 自定义搜索filter -->
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, column }" class="custom-filter-dropdown">
        <a-input v-ant-ref="(c) => (searchInput = c)" :placeholder="`搜索 ${column.title}`" :value="selectedKeys[0]"
          @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])" @pressEnter="() => handleSearch(selectedKeys, confirm)" style="width: 188px; margin-bottom: 8px; display: block"/>
        <a-button type="primary" @click="() => handleSearch(selectedKeys, confirm)" icon="search" size="small" style="width: 100%; margin-right: 8px">Search</a-button>
      </div>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#30A679' : undefined }"/>
      <template slot="role" slot-scope="record">
        {{ record.role.name }}
      </template>
      <template slot="avatar" slot-scope="avatar">
        <img :src="avatar" alt="" style="width: 60px; height: 60px; cursor: pointer; object-fit: cover" @click="avatarHandlePreview(avatar)"/>
        <a-modal :visible="previewVisibleAvatar" :footer="null" @cancel="handleCancelAvatar">
          <img alt="example" style="width: 100%" :src="avatarPreviewImage" />
        </a-modal>
      </template>
      <template slot="action" slot-scope="record">
        <a-button type="dashed" class="mr-1" @click="callEdit(record)" v-permission:btn="'1-0'">编辑</a-button>
        <a-button type="primary" class="mr-1" @click="callReset(record)" v-permission:btn="'1-1'">重置密码</a-button>
        <a-button type="danger" @click="__callDelete(record)" v-permission:btn="'1-2'">删除</a-button>
      </template>
    </a-table>
    <!-- 编辑界面 -->
    <a-modal :title="modal === 'edit' ? '编辑员工' : '创建员工'" width="600px" :destroyOnClose="true" :visible="modal !== ''" centered @ok="__callSave" @cancel="callCancel" okText="确定" cancelText="取消">
      <div class="mb-1">
        <a-radio-group buttonStyle="solid" v-model="staff.role">
          <a-radio-button :value="item.value" v-for="item in roles" :key="item.text">{{ item.text }}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="mb-1">
        <div>
          <a-input placeholder="请输入姓名" v-model="staff.name" class="mb-1">
            <div slot="addonBefore" style="width: 60px">姓名</div>
          </a-input>
          <a-input placeholder="Nickname" v-model="staff.nickname" class="mb-1">
            <div slot="addonBefore" style="width: 60px">昵称</div>
          </a-input>
        </div>
        <div v-if="modal === 'create'">
          <a-input placeholder="请输入用户名" v-model="staff.username" class="mb-1">
            <div slot="addonBefore" style="width: 60px">用户名</div>
            <div slot="addonAfter" style="width: 180px">{{ email }}</div>
          </a-input>
          <a-input placeholder="请输入密码" v-model="staff.password">
            <div slot="addonBefore" style="width: 60px">密码</div>
            <div slot="addonAfter" style="width: 180px">
              (默认值 12345678 请自行修改)
            </div>
          </a-input>
        </div>
      </div>
      <div>
        <div style="width: 100px" class="mb-1">员工头像</div>
        <div class="clearfix">
          <a-upload name="picture" :action="action + '/uploadsImgLimit'" list-type="picture-card" :file-list="fileListAvatar" :data="{ project: 'marryTest' }" @preview="handlePreviewAvatar" @change="handleChangeImgAvatar">
            <div v-if="fileListAvatar.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisibleAvatar" :footer="null" @cancel="handleCancelAvatar">
            <img alt="example" style="width: 100%" :src="previewAvatarUrl" />
          </a-modal>
        </div>
      </div>
    </a-modal>
    <!-- 重置密码 -->
    <a-modal
      :title="'重置密码'"
      width="400px" :destroyOnClose="true" centered :visible="resetModal" @ok="__callResetPassword" @cancel="resetModal = false" okText="确定" cancelText="取消">
      <div class="d-flex a-center">
        <a-input addonBefore="新密码" placeholder="请输入新密码" v-model="staff.password"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import api from "@/api/staff.js";
export default {
  data() {
    return {
      // 集中控制过滤
      filters: {
        name: [],
        role: [],
      },
      email: process.env.VUE_APP_BASE_EMAIL,
      action: process.env.VUE_APP_BASE_ACTION,
      roles: [],
      pagination: "",
      staffs: [],
      staff: "",
      modal: "",
      imageUrlAvatar: "",
      resetModal: false,
      previewAvatarUrl: "",
      avatarPreviewImage: "",
      fileListAvatar: [],
      previewVisibleAvatar: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "员工",
          key: "name",
          dataIndex: "name",
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
          filteredValue: this.filters.name,
          width: 160,
          align: "center",
        },
        {
          title: "昵称",
          key: "nickname",
          dataIndex: "nickname",
          align: "center",
        },
        {
          title: "角色",
          key: "role",
          align: "center",
          filters: this.roles,
          filteredValue: this.filters.role,
          scopedSlots: {
            customRender: "role",
          },
          width: 140,
          align: "center",
        },
        {
          title: "员工头像",
          key: "avatar",
          dataIndex: "avatar",
          scopedSlots: {
            customRender: "avatar",
          },
          align: "center",
        },
        {
          title: "用户名",
          key: "username",
          dataIndex: "username",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
          width: 300,
          align: "center",
        },
      ];
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.initFilters();
      this.pagination = {
        current: 1,
        pageSize: 5,
      };
      this.__queryRoles();
      this.__queryStaffs();
    },
    initFilters() {
      this.filters = {
        name: [],
        role: [],
      };
    },
    handleChange(pagination, filters) {
      if (filters.role.length > 0) {
        filters.name = [];
      }
      this.filters = filters;
      // 处理分页
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.__queryStaffs();
    },
    handleSearch(selectedKeys, confirm) {
      confirm();
    },
    callCreate() {
      this.modal = "create";
      this.staff = {
        nickname: "",
        name: "",
        username: "",
        password: "12345678",
        role: "",
      };
    },
    callEdit(record) {
      this.modal = "edit";
      this.staff = {
        _id: record._id,
        name: record.name,
        nickname: record.nickname,
        role: record.role._id,
      };
      this.fileListAvatar[0] = {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: record.avatar,
      };
    },
    callCancel() {
      this.modal = "";
      this.staff = "";
      this.fileListAvatar = [];
    },
    callReset(record) {
      this.staff = {
        _id: record._id,
        password: "",
      };
      this.resetModal = true;
    },
    async __queryRoles() {
      let roles = await api.getRoles();
      this.roles = roles.data.map((role) => {
        return {
          text: role.name,
          value: role._id,
        };
      });
    },
    async __queryStaffs() {
      try {
        let { current, pageSize } = this.pagination;
        let res = await api.getStaffs(this.filters, current, pageSize);
        let payload = res.data;
        let total = res.total;
        this.staffs = [...payload];
        this.pagination = { ...this.pagination, total };
      } catch (err) {
        this.staffs = [];
        this.pagination = { ...this.pagination, total: 0 };
        this.$message.error(err.message);
      }
    },
    async __callSave() {
      if (this.modal === "create") {
        if (
          !this.staff.name ||
          !this.staff.username ||
          !this.staff.password ||
          !this.staff.role
        ) {
          return this.$message.error("请填写完整信息");
        }
      }
      if (this.modal === "edit") {
        if (!this.staff.name || !this.staff.role) {
          return this.$message.error("请填写完整信息");
        }
      }
      try {
        if (this.modal === "create") {
          const payload = {
            nickname: this.staff.nickname,
            name: this.staff.name,
            role: this.staff.role,
            username: this.staff.username + this.email,
            password: this.staff.password,
            avatar:
              this.fileListAvatar.length > 0 ? this.fileListAvatar[0].url : "",
          };
          await api.createStaff(payload);
          this.$message.success("创建成功");
        }
        if (this.modal === "edit") {
          const payload = {
            nickname: this.staff.nickname,
            name: this.staff.name,
            role: this.staff.role,
            avatar:
              this.fileListAvatar.length > 0 ? this.fileListAvatar[0].url : "",
          };
          await api.updateStaff(this.staff._id, payload);
          this.$message.success("修改成功");
        }
        this.refresh();
        this.callCancel();
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async __callResetPassword() {
      try {
        await api.resetPassword(this.staff._id, this.staff.password);
        this.$message.success("密码重置成功");
      } catch (err) {
        this.$message.error(err.message);
      }
      this.resetModal = false;
    },
    async __callDelete(record) {
      this.$confirm({
        title: `确定要删除该员工：${record.name}?`,
        okType: "danger",
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          try {
            await api.deleteStaff(record._id);
            this.refresh();
            this.$message.success("删除成功");
          } catch (err) {
            this.$message.error(err.message);
          }
        },
        onCancel() {},
      });
    },
    handleCancelAvatar() {
      //关闭预览头像
      this.previewVisibleAvatar = false;
    },
    async handlePreviewAvatar(file) {
      //弹窗预览头像
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewAvatarUrl = file.url || file.preview;
      this.previewVisibleAvatar = true;
    },
    handleChangeImgAvatar({ fileList }) {
      //更换头像
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.imageUrl;
        }
        return file;
      });
      this.fileListAvatar = fileList;
    },
    async avatarHandlePreview(url) {
      //列表预览头像
      this.avatarPreviewImage = url;
      this.previewVisibleAvatar = true;
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
