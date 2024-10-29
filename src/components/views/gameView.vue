<template>
  <div class="flex">
    <side-menu/>
    <router-view/>
  </div>
</template>

<script>
import SideMenu from "./sideMenu.vue";
import {mapGetters} from "vuex";

export default {
  components: {
    SideMenu,
  },
  computed: {
    ...mapGetters({
      currentStateId: "currentStateId"
    }),
  },
  created() {
    if (this.currentStateId === 0)
      this.$router.push("/");
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}
</style>
