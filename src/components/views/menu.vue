<template>
    <div>
        <custom-input-modal
            v-show="modalVisible"
            :form-submit="newGame"
            name="newGameModal"
            @close="modalVisible = false"
        >
            <template v-slot:header>{{$t('menu.new_game')}}</template>
            <template v-slot:body>
                <custom-input v-model="gameName" :placeholder="$t('menu.game_name')"/>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px">{{$t('common.accept')}}</custom-button>
                <custom-button
                    style="width:150px"
                    @click="modalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-input-modal>
    </div>
    <container class="menu">
        <header>
            <h2>{{$t('menu.title')}}</h2>
        </header>
        <div>
            <custom-button class="menu-button" @click="modalVisible = true">{{$t('menu.new_game')}}</custom-button>
            <custom-button class="menu-button" @click="loadGame">{{$t('menu.load_game')}}</custom-button>
            <custom-button v-if="isUserAdmin" class="menu-button" @click="loadAdmin">Admin</custom-button>
            <custom-button class="menu-button" @click="logout">
              {{$t('menu.logout')}}
            </custom-button>
          <custom-local-switcher/>
        </div>
    </container>
</template>

<script>
import {mapGetters} from "vuex";
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomInputModal from "../custom/Custom-Input-Modal.vue";
import CustomInput from "../custom/Custom-Input";
import {fetchGETHeader} from "@/middleware/communication.handle";
import CustomLocalSwitcher from "@/components/custom/Custom-Local-Switcher";

export default {
    components: {CustomLocalSwitcher, CustomInput, Container, CustomButton, CustomInputModal},
    created() {
        fetchGETHeader('users/check', this.$store.getters.currentUserToken)
            .then(data => {
                if (!data.status) {
                    this.$store.dispatch('resetStore');
                    this.$router.push("/login");
                }
            })
            .catch(() => {
                this.$store.dispatch('resetStore');
                this.$router.push("/login");
            });
    },
    data() {
        return {
            modalVisible: false,
            gameName: ''
        }
    },
    computed: {
        ...mapGetters({
            currentUser: "currentUser",
        }),
        isUserAdmin() {
            if (!this.currentUser) return undefined;
            return this.currentUser.role === "admin";
        }
    },
    methods: {
        newGame() {
            this.modalVisible = false;
            this.$store.subscribe((mutation) => {
                if (mutation.type === "setGame") this.$router.push("/game");
            });
            this.$store.dispatch("newGame", {gameName: this.gameName});
            this.gameName = '';
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },
        loadGame() {
            this.$router.push("/loadGame");
        },
        loadAdmin() {
            this.$router.push("/admin/overview");
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

.menu-button {
    width: 90%;
}
</style>
