<template>
  <li>
    <router-link :to="{ name: target.route, params: target.params}">
      <button><span v-if="icon" :class="`mdi mdi-${icon}`"/> {{ target.title }}</button>
    </router-link>
  </li>
</template>

<script>

export default {
  props: {
    icon: {
      type: String,
      default: undefined
    },
    /**
     * {
     *   title: String,
     *   route: String,
     *   params: Object
     * }
     */
    target: {
      type: Object,
      default: () => {
        return {
          title: "",
          route: "",
          params: ""
        }
      }
    }
  },
};
</script>


<style scoped>
@import "https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css";

button {
  border: none;
  font-weight: 700;
  font-size: large;
  color: rgb(0, 0, 0);
  width: 95%;
  background-color: inherit;
  text-align: left;
  border-radius: 5px;
}

li {
  margin-bottom: 0.5rem;
  height: 25px;
}

button:enabled {
  cursor: pointer;
}

button:hover:enabled {
  /* background: #f9aa33; */
  background: #eeeeee;
}
</style>
