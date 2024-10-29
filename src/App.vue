<template>
    <error-view/>
    <router-view></router-view>
</template>

<script>
import ErrorView from "./components/views/errorView";

export default {
    components: {ErrorView},
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000000;
}

body {
    background-color: #e8e8e8;
    background-size: cover;
    margin: 10px 0 0;
    text-align: left;
}

h3 {
    text-align: left;
    margin: 1rem;
}

::-webkit-scrollbar-track {
    border: 3px solid white;
    background-color: #b2bec3;
}

::-webkit-scrollbar {
    width: 5px;
    background-color: #dfe6e9;
}

::-webkit-scrollbar-thumb {
    background-color: #afafaf;
    border-radius: 10px;
}
</style>
