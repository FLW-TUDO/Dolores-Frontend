<template>
    <div>
        <h3 v-if="title">{{ title }}</h3>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>

<style scoped>
div {
    padding: 1rem;
    margin: 0 0.25rem 0.25rem;
    background-color: #ffffff;
    /* box-shadow */
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
