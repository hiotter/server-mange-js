<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {},
};
</script>

<style>
@import "./style/simple-ui.css";
.container-normal {
  position: relative;
  background: white;
  margin: 20px;
  padding: 16px;
  min-height: calc(100% - 40px);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.neumorphism {
  border-radius: 2px;
  background: #f7f7f7;
  box-shadow: 30px 30px 60px #d2d2d2, -30px -30px 60px #ffffff;
}
.loading-gif {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 1);
  /* background-image: url(./assets/images/loading.gif); */
  background-size: 24%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 999;
}
</style>
