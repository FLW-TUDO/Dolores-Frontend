<template>
  <div class="selectdiv">
    <select v-model="proxyModelVal">
      <slot> </slot>
    </select>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  computed: {
    proxyModelVal: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },
};
</script>
