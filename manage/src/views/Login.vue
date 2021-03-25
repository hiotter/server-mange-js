<template>
  <div class="box">
    <div class="login-form">
      <div
        style="font-size: 30px; font-family: sans-serif; text-align: center"
        class="mb-3 d-flex a-center j-sb"
      >
        <div>
          <img
            src="../assets/ebuy-logo.png"
            alt=""
            style="width: 100px; margin: 0 15px 0 0"
            class="logo-icon"
          />
        </div>
        <div style="color: #000000; text-algin: center">XXXX 后台登录界面</div>
      </div>
      <div class="d-flex a-center input-wrap mb-2">
        <img
          src="../assets/icons/user.png"
          alt=""
          style="width: 16px; margin-left: 15px"
        />
        <input type="text" v-model="username" />
      </div>
      <div class="d-flex a-center input-wrap mb-2">
        <img
          src="../assets/icons/lock.png"
          alt=""
          style="width: 14px; margin-left: 15px; margin-right: 2px"
        />
        <input type="password" v-model="password" />
      </div>
      <div class="neumorphism-btn p-1 d-flex a-center j-center" @click="login">
        登 录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  created() {
    if (
      process.env.NODE_ENV == "staging" ||
      process.env.NODE_ENV == "development"
    ) {
      console.log("这是staging环境");
      this.username = `admin${process.env.VUE_APP_BASE_EMAIL}`;
      this.password = "12345678";
    }
  },
  methods: {
    async login() {
      try {
        const payload = {
          username: this.username,
          password: this.password,
        };
        await this.$store.dispatch("permission/__login", payload);
        this.$router
          .push({
            name: "仪表板",
          })
          .catch(() => {});
        this.$message.success("登录成功");
      } catch (err) {
        this.$message.error(err.message);
      }
    },
  },
};
</script>

<style scoped>
.box {
  height: 100vh;
  padding-top: 160px;
  background-color: #f7f7f7;
  background-repeat: no-repeat;
  background-position: bottom;
}
.logo-icon {
  border-radius: 25px;
  background: #f7f7f7;
  box-shadow: 20px 20px 60px #d2d2d2, -20px -20px 60px #ffffff;
}
.login-form {
  color: black;
  width: 80%;
  max-width: 520px;
  padding: 30px;
  margin: auto;
}
.input-wrap {
  height: 45px;
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}
input {
  flex: 1;
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
  padding-left: 15px;
  padding-right: 15px;
}
.neumorphism-btn {
  cursor: pointer;
  color: white;
  border-radius: 3px;
  background: #c72c2e;
  transition: all 0.3s;
}
.neumorphism-btn:hover {
  background: rgba(199, 44, 46, 0.7);
  transition: all 0.3s;
  transform: translateY(-3px);
  box-shadow: 20px 20px 60px #dfe3ee, -20px -20px 60px #eeeeee;
}
</style>
