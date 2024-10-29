<template>
  <div>
    <input v-model="proxyModelVal" :type="type" autocomplete="on" required/>
    <label v-if="placeholder">{{ placeholder }}</label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {},
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: ""
    }

  },
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

<style scoped>
input {
  border: 0;
  border-bottom: 1px solid #999;
  background: transparent;
  font-weight: bold;
  font-size: 15px;
  color: rgb(0, 0, 0);
  margin-bottom: 15px;
  margin-top: 15px;
  width: 100%;
  box-sizing: border-box;
}

input[type="number"] {
  width: 3rem;
}

input:focus,
input:valid {
  border: none;
  outline: none;
  border-bottom: 1px solid #007598;
}

div {
  position: relative;
}

div label {
  position: absolute;
  top: 8px;
  left: 0;
  color: #999;
  transition: .5s;
  pointer-events: none;
}

input:focus ~ label,
input:valid ~ label {
  top: -12px;
  left: 0;
  color: #007598;
  font-size: 12px;
  font-weight: bold;
}
</style>
