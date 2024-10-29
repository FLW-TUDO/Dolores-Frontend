<template>
  <custom-modal v-if="error.status" @close="resetError">
    <template v-slot:header>{{ error.error }}</template>
    <template v-slot:body>{{ error.message }}</template>
    <template v-slot:footer>
      <custom-button @click="resetError">Ok</custom-button>
    </template>
  </custom-modal>
</template>

<script>
import {mapGetters} from "vuex";
import CustomModal from "@/components/custom/Custom-Modal.vue";
import CustomButton from "@/components/custom/Custom-Button";

export default {
  name: "errorView",
  components: {CustomButton, CustomModal},
  computed: {
    ...mapGetters({
      error: "error",
    }),
  },
  methods: {
    resetError() {
      this.$store.dispatch("resetError");
    }
  }
}
</script>