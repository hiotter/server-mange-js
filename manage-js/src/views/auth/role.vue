<template>
  <div class="container-normal">
    <a-button type="primary" @click="callCreate">创建角色</a-button>
    <a-table
      class="mt-2"
      :columns="columns"
      :dataSource="roles"
      rowKey="name"
      bordered
      :pagination="false"
    >
      <template
        slot="action"
        slot-scope="record"
        v-if="record.name !== '管理员'"
      >
        <a-button type="dashed" class="mr-1" @click="callEdit(record)"
          >编辑</a-button
        >
        <a-button
          type="danger"
          @click="__callDelete(record)"
          :disabled="record.staffsCount !== 0"
          >删除</a-button
        >
      </template>
    </a-table>
    <!-- 编辑界面 -->
    <a-modal
      :title="modal === 'edit' ? '编辑角色' : '创建角色'"
      width="800px"
      :destroyOnClose="true"
      centered
      :visible="modal !== ''"
      @ok="__callSave"
      @cancel="callCancel"
      :confirmLoading="processing"
    >
      <a-input
        addonBefore="名称"
        placeholder="角色名称"
        v-model="role.name"
        class="mb-1"
      />
      <a-input addonBefore="描述" placeholder="描述" v-model="role.desc" />
      <div class="d-flex mt-3">
        <div class="flex-1 d-flex flex-column a-center">
          <div style="font-weight: bold; color: black">页面级权限分配</div>
          <a-tree
            checkable
            @expand="onExpandPageLevel"
            :expandedKeys="pageLevel.expandedKeys"
            :autoExpandParent="pageLevel.autoExpandParent"
            v-model="pageLevel.checkedKeys"
            @select="onSelectPageLevel"
            :selectedKeys="pageLevel.selectedKeys"
            :treeData="pageLevel.treeData"
          />
        </div>
        <div class="flex-1 d-flex flex-column a-center">
          <div style="font-weight: bold; color: black">按钮级权限分配</div>
          <a-tree
            checkable
            @expand="onExpandButtonLevel"
            :expandedKeys="buttonLevel.expandedKeys"
            :autoExpandParent="buttonLevel.autoExpandParent"
            v-model="buttonLevel.checkedKeys"
            @select="onSelectButtonLevel"
            :selectedKeys="buttonLevel.selectedKeys"
            :treeData="buttonLevel.treeData"
          />
        </div>
        <div class="flex-1 d-flex flex-column a-center">
          <div style="font-weight: bold; color: black">内容级权限分配</div>
          <a-tree
            checkable
            @expand="onExpandContentLevel"
            :expandedKeys="contentLevel.expandedKeys"
            :autoExpandParent="contentLevel.autoExpandParent"
            v-model="contentLevel.checkedKeys"
            @select="onSelectContentLevel"
            :selectedKeys="contentLevel.selectedKeys"
            :treeData="contentLevel.treeData"
          />
        </div>
        <div class="flex-1 d-flex flex-column a-center">
          <div style="font-weight: bold; color: black" class="mb-1">
            其他权限
          </div>
          <a-checkbox-group
            :defaultValue="role.othersAuths"
            @change="onChangeOthers"
          >
            <a-row>
              <a-col
                :span="24"
                v-for="(other, index) in othersAuths"
                :key="index"
                ><a-checkbox :value="other">{{ other }}</a-checkbox></a-col
              >
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api/role.js";
import { asyncRoutes } from "@/router/routes.js";
import {
  buttonsAuthsMap,
  contentsAuthsMap,
  othersAuthsMap,
} from "@/directive/permission.js";
const renderPageTree = (routes) => {
  console.log(6666, routes);
  return routes.map((route) => {
    return {
      title: route.name,
      key: route.name,
      children: route.children.map((child) => {
        return {
          title: child.name,
          key: child.name,
        };
      }),
    };
  });
};
const renderButtonTree = () => {
  return buttonsAuthsMap;
};
const renderContentTree = () => {
  return contentsAuthsMap;
};
export default {
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          dataIndex: "name",
          width: 200,
        },
        {
          title: "描述",
          key: "desc",
          dataIndex: "desc",
        },
        {
          title: "包含员工数",
          key: "staffsCount",
          dataIndex: "staffsCount",
          width: 120,
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: {
            customRender: "action",
          },
          width: 200,
          align: "center",
        },
      ],
      roles: [],
      role: "",
      modal: "",
      processing: false,
      pageLevel: "",
      buttonLevel: "",
      contentLevel: "",
      othersAuths: othersAuthsMap,
    };
  },
  created() {
    this.__queryRoles();
  },
  methods: {
    initPageLevel(routesAuths) {
      let treeData = renderPageTree(
        asyncRoutes.filter((route) => route.name !== "权限管理")
      );
      console.log(444555, treeData);
      let checkedKeys = [...routesAuths];
      treeData.forEach((item) => {
        if (item.children) {
          if (
            !item.children.every((child) => routesAuths.includes(child.key))
          ) {
            checkedKeys = checkedKeys.filter((k) => k !== item.key);
          }
        }
      });
      this.pageLevel = {
        treeData: treeData,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [...checkedKeys],
        selectedKeys: [],
      };
    },
    initButtonLevel(buttonsAuths) {
      let treeData = renderButtonTree();
      let checkedKeys = [...buttonsAuths];
      treeData.forEach((item) => {
        if (item.children) {
          if (
            !item.children.every((child) => buttonsAuths.includes(child.key))
          ) {
            checkedKeys = checkedKeys.filter((k) => k !== item.key);
          }
        }
      });
      this.buttonLevel = {
        treeData: treeData,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [...checkedKeys],
        selectedKeys: [],
      };
    },
    initContentLevel(contentsAuths) {
      let treeData = renderContentTree();
      let checkedKeys = [...contentsAuths];
      treeData.forEach((item) => {
        if (item.children) {
          if (
            !item.children.every((child) => contentsAuths.includes(child.key))
          ) {
            checkedKeys = checkedKeys.filter((k) => k !== item.key);
          }
        }
      });
      this.contentLevel = {
        treeData: treeData,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [...checkedKeys],
        selectedKeys: [],
      };
    },
    onExpandPageLevel(expandedKeys) {
      this.pageLevel.expandedKeys = expandedKeys;
      this.pageLevel.autoExpandParent = false;
    },
    onSelectPageLevel(selectedKeys, info) {
      this.pageLevel.selectedKeys = selectedKeys;
    },
    onExpandButtonLevel(expandedKeys) {
      this.buttonLevel.expandedKeys = expandedKeys;
      this.buttonLevel.autoExpandParent = false;
    },
    onSelectButtonLevel(selectedKeys, info) {
      this.buttonLevel.selectedKeys = selectedKeys;
    },
    onExpandContentLevel(expandedKeys) {
      this.contentLevel.expandedKeys = expandedKeys;
      this.contentLevel.autoExpandParent = false;
    },
    onSelectContentLevel(selectedKeys, info) {
      this.contentLevel.selectedKeys = selectedKeys;
    },
    callCreate() {
      this.modal = "create";
      this.role = {
        name: "",
        desc: "",
        routesAuths: [],
        buttonsAuths: [],
        contentsAuths: [],
        othersAuths: [],
      };
      this.initPageLevel(this.role.routesAuths);
      this.initButtonLevel(this.role.buttonsAuths);
      this.initContentLevel(this.role.contentsAuths);
    },
    callEdit(record) {
      this.modal = "edit";
      this.role = { ...record };
      this.initPageLevel(this.role.routesAuths);
      this.initButtonLevel(this.role.buttonsAuths);
      this.initContentLevel(this.role.contentsAuths);
    },
    callCancel() {
      this.modal = "";
      this.role = "";
    },
    async __queryRoles() {
      try {
        let roles = await api.getRoles();
        this.roles = [...roles.data];
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async __callSave() {
      if (!this.role.name || !this.role.desc) {
        return this.$message.error("请填写名称以及描述");
      }
      this.processing = true;
      let routesAuths = [];
      this.pageLevel.treeData.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            if (this.pageLevel.checkedKeys.includes(child.key)) {
              routesAuths = [...routesAuths, item.key];
            }
          });
        }
      });
      let buttonsAuths = [];
      this.buttonLevel.treeData.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            if (this.buttonLevel.checkedKeys.includes(child.key)) {
              buttonsAuths = [...buttonsAuths, item.key];
            }
          });
        }
      });
      let contentsAuths = [];
      this.contentLevel.treeData.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            if (this.contentLevel.checkedKeys.includes(child.key)) {
              contentsAuths = [...contentsAuths, item.key];
            }
          });
        }
      });
      routesAuths = this.$_.uniq([
        ...routesAuths,
        ...this.pageLevel.checkedKeys,
      ]);
      buttonsAuths = this.$_.uniq([
        ...buttonsAuths,
        ...this.buttonLevel.checkedKeys,
      ]);
      contentsAuths = this.$_.uniq([
        ...contentsAuths,
        ...this.contentLevel.checkedKeys,
      ]);
      try {
        const payload = {
          name: this.role.name,
          desc: this.role.desc,
          routesAuths,
          buttonsAuths,
          contentsAuths,
          othersAuths: this.role.othersAuths,
        };
        if (this.modal === "create") {
          await api.createRole(payload);
          this.$message.success("创建成功");
        }
        if (this.modal === "edit") {
          await api.updateRole(this.role._id, payload);
          this.$message.success("修改成功");
        }
        this.processing = false;
        this.modal = "";
        this.role = "";
      } catch (err) {
        this.$message.error(err.message);
        this.processing = false;
      }
      await this.__queryRoles();
    },
    async __callDelete(record) {
      this.processing = true;
      try {
        await api.deleteRole(record._id);
        this.roles = this.roles.filter((item) => item._id != record._id);
        this.$message.success("删除成功");
      } catch (err) {
        this.$message.error(err.message);
      }
      this.processing = false;
    },
    onChangeOthers(checkedValues) {
      this.role.othersAuths = checkedValues;
    },
  },
};
</script>

<style>
</style>
