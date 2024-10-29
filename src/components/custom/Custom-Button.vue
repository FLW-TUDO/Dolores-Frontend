<template>
  <button>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  border: none;
  margin: 0.5vh 0;
  padding: 5px 15px;
  font-weight: 600;
  background: #ebebeb;
  /* background: #4a6572; */
  color: rgb(0, 0, 0);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

button:enabled {
  cursor: pointer;
}

button:disabled {
  background: #c0c0c0;
}

button:hover:enabled {
  /* background: #f9aa33; */
  background: #f8f8f8;
}

button:active:enabled {
  background: #007598;
  top: 2px;
}
</style>
