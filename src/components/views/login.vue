<template>
    <container class="menu">
        <div>
            <h2>Login</h2>
        </div>
        <form @submit.prevent="login">
            <div>
                <custom-input v-model="userName" :placeholder="$t('login.username')" type="text"/>
            </div>
            <div>
                <custom-input v-model="password" :placeholder="$t('login.password')" type="password"/>
            </div>
            <br>
            <custom-button>Login</custom-button>
        </form>
    </container>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomInput from "../custom/Custom-Input.vue";
import CustomButton from "@/components/custom/Custom-Button";

export default {
    components: {CustomButton, Container, CustomInput},
    data() {
        return {
            userName: "",
            password: "",
        };
    },
    created() {
        if (this.$store.getters.isLoggedIn)
            this.$router.push("/");
    },
    methods: {
        login() {
            this.$store.subscribe((mutation) => {
                if (mutation.type === "setAuth") this.$router.push("/");
                else if (mutation.type === "setError") {
                    this.userName = '';
                    this.password = '';
                }
            });
            this.$store.dispatch("login", {
                userName: this.userName,
                password: this.password
            });
        },
    },
};
</script>

<style scoped>
.menu {
    position: relative;
    width: 16rem;
    display: inline-block;
    margin: 16rem 0;
}
</style>