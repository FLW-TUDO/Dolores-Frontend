<template>
  <div v-if="playerCount > 1" class="grid box">
    <button v-for="index in playerCount" :key="index">
      <span v-if="index - 1 === playerId" :class="`mdi mdi-alpha-${indexLetterMapping(index)}-box`"/>
      <span v-else :class="`mdi mdi-alpha-${indexLetterMapping(index)}-box-outline`"/>
    </button>
  </div>
</template>

<script>
import {closeWS, createWebSocket} from "@/middleware/communication.handle.js";
import {mapGetters} from "vuex";

export default {
  name: "lobby",
  created() {
    createWebSocket(this.$store);
  },
  beforeUnmount() {
    closeWS();
  },
  data() {
    return {
      letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
    }
  },
  methods: {
    indexLetterMapping(index) {
      return this.letters[index - 1];
    }
  },
  computed: {
    ...mapGetters({
      playerId: "currentLobbyId",
      playerCount: "currentLobbyCount",
    })
  }
}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css";


button {
  border: none;
  color: rgb(0, 0, 0);
  background-color: inherit;
  border-radius: 5px;
  width: 35px;
  height: 35px;
  font-size: x-large;
}

button:hover:enabled {
  /* background: #f9aa33; */
  background: #eeeeee;
}

.box {
  margin-left: 1rem;
  margin-top: 1rem;
}

.grid {
  display: grid;
  grid-template-columns:  repeat(4, 1fr);
}

hr {
  display: block;
  border: 0;
  border-top: 1px solid #f1f1f1;
}
</style>