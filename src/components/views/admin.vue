<template>
    <div class="overlay">
        <custom-button class="menu-button" @click="back">Zurück</custom-button>
        <custom-button class="menu-button" @click="logout">Logout</custom-button>
    </div>
    <router-view></router-view>
</template>

<script>
import CustomButton from "../custom/Custom-Button.vue";

export default {
    components: {CustomButton},
    methods: {
        back() {
            this.$router.back()
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },
    }
}
</script>

<style scoped>
.overlay {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: absolute;
    width: 12rem;
    left: 0;
    top: 0;
}

.menu-button {
    margin: 5px;
}
</style>
