<template>
  <div class="d-flex flex-wrap mb-2 neumorphism">
    <div class="d-flex a-center j-center p-2" style="flex-basis: 14%" v-for="(item, index) in items" :key="index">
      <div v-permission:ctn="'1-' + index" style="border-radius: 1px;overflow: hidden;cursor: pointer;border-radius: 2px;background-color: white;"
        class="flex-1 d-flex j-center count-card" @click="callDirect(index)">
        <div class="d-flex a-center j-center" style="width: 60px; height: 60px">
          <img :src="item.icon" alt="" style="height: 60px; width: 60px" />
        </div>
        <div class="flex-1 pl-1">
          <div>{{ item.title }}</div>
          <div style="font-size: 22px; font-weight: bold">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"],
  methods: {
    callDirect(index) {
      switch (index) {
        case 0:
          this.$router.push({
            name: "员工管理",
            query: {
              date: "所有员工",
            },
          });
          break;
        // case 1:
        //   this.$router.push({
        //     name: "仪表板",
        //     query: {
        //       date: "我的用户",
        //     },
        //   });
        //   break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.count-card {
  transition: all 0.3s;
}

.count-card:hover {
  transition: all 0.3s;
  transform: translateY(-3px);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
