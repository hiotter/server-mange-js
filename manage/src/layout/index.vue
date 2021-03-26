<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"
  >
    <!-- 侧栏导航菜单 -->
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      style="overflow: auto"
    >
      <div class="logo" style="position: fixed; z-index: 1">
        <div style="background: rgba(255, 255, 255, 0.2); flex: 1">
          <div style="display: flex; align-items: center" v-if="!collapsed">
            <img
              src="../assets/logo-hita.png"
              alt=""
              style="width: 50px; margin: 0 15px 0 0"
              class="logo-icon"
            />
            <div style="font-size: 18px">Hita</div>
          </div>
          <!-- <img v-if="collapsed" src="../assets/logo.jpg" alt="" style="width:40px"> -->
        </div>
      </div>
      <div style="height: 64px"></div>
      <a-menu
        mode="inline"
        theme="dark"
        :selectedKeys="[$route.name]"
        :openKeys="openKeys"
        @openChange="onOpenChange"
        @select="callNavigation"
      >
        <template v-for="item in menu">
          <template v-if="item.children">
            <a-sub-menu :key="item.name">
              <span slot="title">
                <a-icon :type="item.icon" /><span>{{ item.title }}</span></span
              >
              <a-menu-item :key="child.name" v-for="child in item.children">
                <a-icon :type="child.icon" />
                <span>{{ child.title }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-if="!item.children">
            <a-menu-item :key="item.name">
              <a-icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
      <div></div>
    </a-layout-sider>
    <!-- 右侧header + main content -->
    <a-layout>
      <!-- header -->
      <a-layout-header
        style="
          padding: 0 20px;
          background: #fff;
          display: flex;
          align-items: center;
          border-bottom: 1px solid lightgrey;
        "
      >
        <!-- <a-icon class="trigger mr-2" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="()=> collapsed = !collapsed" /> -->
        <div style="font-size: 24px; font-family: serif; min-width: 160px">
          后台管理系统
        </div>
        <div style="font-size: 18px">v0.0.1</div>
        <div class="d-flex a-center mx-5" style="padding-top: 15px">
          <!-- <img src="../assets/icons/slogan.png" alt="" style="height: 40px;"> -->
        </div>
        <div class="ml-auto">
          <a-dropdown :trigger="['click']">
            <div
              class="d-flex a-center"
              style="cursor: pointer; min-width: 250px"
            >
              <div class="d-flex a-center j-center mr-1">
                <img
                  src="../assets/icons/logo.svg"
                  alt=""
                  style="width: 48px"
                />
              </div>
              <div class="ml-auto" v-if="userInfo">
                <div style="line-height: 16px; margin-bottom: 5px">
                  昵称：{{ userInfo.nickname }}
                </div>
                <div style="line-height: 16px">
                  用户名：{{ userInfo.username }}
                </div>
              </div>
            </div>
            <a-menu slot="overlay">
              <a-menu-item
                key="auth"
                @click="callAuth"
                v-if="userInfo && userInfo.role.name === '管理员'"
                >权限设置</a-menu-item
              >
              <a-menu-item key="logout" @click="callLogout"
                >退出登录</a-menu-item
              >
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- main content -->
      <div id="main-content">
        <transition name="fade-transform" mode="out-in">
          <keep-alive
            include="suspicious-order,login-record,operation-record,order-info,complaint,product-info,product-setting-info,customer,finance-driver,finance-refund,district-info,feedback,message,uncollected"
          >
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      collapsed: false,
      openKeys: [],
      busInfo: "",
      loading: false,
    };
  },
  computed: {
    ...mapState("permission", ["menu", "userInfo"]),
    rootSubmenuKeys() {
      return this.menu.map((item) => item.name);
    },
  },
  watch: {
    $route(to, from) {
      this.callOpen();
    },
  },
  mounted() {
    this.callOpen();
    console.log(123, this.userInfo);
    console.log(123, this.menu);
  },
  methods: {
    callOpen() {
      this.openKeys = [];
      this.menu
        .filter((item) => item.children)
        .forEach((item) => {
          if (item.children.some((child) => child.name == this.$route.name)) {
            this.openKeys = [item.name];
          }
        });
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
      // 默认跳转第一个子菜单
      if (latestOpenKey) {
        let key = this.menu.find((item) => item.name == latestOpenKey)
          .children[0].name;
        this.callNavigation({ key });
      }
    },
    callNavigation(e) {
      this.$router
        .push({
          name: e.key,
        })
        .catch(() => {});
    },
    callAuth() {
      this.$router.push({
        name: "角色管理",
      });
    },
    callLogout() {
      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  display: flex;
  align-items: center;
  /* padding: 0 24px; */
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #30a679;
}

#components-layout-demo-custom-trigger .logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  color: black;
  font-weight: bold;
  text-align: center;
  background: white;
  border-bottom: 1px solid lightgrey;
  width: 200px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}

#main-content {
  background: #f0f2f5;
  overflow: auto;
  flex: auto;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.logo-icon {
  border-radius: 10px;
  background: #f7f7f7;
  box-shadow: 20px 20px 60px #d2d2d2, -20px -20px 60px #ffffff;
}
.ant-menu-submenu-title {
  display: flex;
  justify-content: space-between;
}
.ant-menu-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
