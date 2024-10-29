<template>
    <div>
        <custom-modal
            v-show="deleteGamesModalVisible"
            name="deleteUserGames"
            @close="deleteGamesModalVisible = false"
        >
            <template v-slot:header>Alle Spiele löschen?</template>
            <template v-slot:body>
                <span>Willst du wirklich alle Spiele des Spielers {{ currentSelectedUserName }} löschen?</span>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="deleteAllGamesByPlayerId()">
                    Bestätigen
                </custom-button>
                <custom-button style="width:150px" @click="deleteGamesModalVisible = false">
                    Abbrechen
                </custom-button>
            </template>
        </custom-modal>

        <custom-modal
            v-show="deletePlayerModalVisible"
            name="deleteUser"
            @close="deletePlayerModalVisible = false"
        >
          <template v-slot:header>Spieler löschen?</template>
          <template v-slot:body>
            <span>Willst du wirklich den Spieler {{ currentSelectedUserName }} löschen?</span>
          </template>
          <template v-slot:footer>
            <custom-button style="width:150px" @click="deletePlayerByPlayerId()">
              Bestätigen
            </custom-button>
            <custom-button style="width:150px" @click="deletePlayerModalVisible = false">
              Abbrechen
            </custom-button>
          </template>
        </custom-modal>
    </div>
    <div class="menu">
        <header>
            <h1>Alle Spieler</h1>
        </header>
        <container>
            <custom-table :columns="userInfoTable" :items="users">
                <template #inputUserActive="slotProps">
                    <input :checked="slotProps.item.status" :disabled="true" type="checkbox"/>
                </template>
                <template #buttonActivateUser="slotProps">
                    <custom-button @click="changeUserStatus(slotProps.item.id)">
                        <template v-if="slotProps.item.status">Sperren</template>
                        <template v-else>Freischalten</template>
                    </custom-button>
                </template>
                <template #buttonGameView="slotProps">
                    <router-link :to="{ name: 'viewGame', params: { userId: slotProps.item.id }}">
                        <custom-button>Spiele ansehen</custom-button>
                    </router-link>
                </template>
                <template #buttonDeleteGames="slotProps">
                    <custom-button @click="openDeleteGamesModal(slotProps.item.id)">Spiele löschen</custom-button>
                </template>
              <template #buttonDeleteUser="slotProps">
                <custom-button @click="openDeleteUserModal(slotProps.item.id)" :disabled="slotProps.item.role == 'admin'">Benutzer löschen</custom-button>
              </template>
            </custom-table>
        </container>
    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import moment from "moment";
import CustomButton from "../custom/Custom-Button.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {fetchDELETEHeader, fetchGETHeader} from "@/middleware/communication.handle";
import {handleFetchError} from "@/middleware/errorHandler";

export default {
    components: {Container, CustomButton, CustomTable, CustomModal},
    data() {
        return {
            users: [],
            userGames: {},
            deleteGamesModalVisible: false,
            deletePlayerModalVisible: false,
            currentSelectedUserId: undefined
        };
    },
    created() {
        fetchGETHeader("users", this.$store.getters.currentUserToken)
            .then((users) => {
                this.users = users;
                this.users.sort((a, b) => {
                  let time_a = new moment(String(a.updatedAt), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
                  let time_b = new moment(String(b.updatedAt), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
                  return time_b - time_a
                })
                users.forEach((user) => {
                    fetchGETHeader(`users/${user.id}/count`, this.$store.getters.currentUserToken)
                        .then((data) => this.userGames[user.id] = data.count);
                });
            }).catch((error) => handleFetchError(this.$store, error, "Could not fetch user base"));
    },
    methods: {
        openDeleteGamesModal(userId) {
            this.currentSelectedUserId = userId;
            this.deleteGamesModalVisible = true;
        },
        openDeleteUserModal(userId) {
          this.currentSelectedUserId = userId;
          this.deletePlayerModalVisible = true;
        },
        toDate(input) {
            return moment(String(input)).format("DD.MM.YYYY");
        },
        deleteAllGamesByPlayerId() {
            if (!this.currentSelectedUserId) return;
            let playerId = this.currentSelectedUserId;
            fetchDELETEHeader(`gameInfos/user/${playerId}`, this.$store.getters.currentUserToken);
            this.userGames[playerId] = 0;
            this.currentSelectedUserId = undefined;
            this.deleteGamesModalVisible = false;
        },
        deletePlayerByPlayerId(){
          if (!this.currentSelectedUserId) return;
          let playerId = this.currentSelectedUserId;
          fetchDELETEHeader(`users/${playerId}`, this.$store.getters.currentUserToken);
          this.users = this.users.filter((user) => user.id !== playerId || user.role === "admin" )
          this.currentSelectedUserId = undefined;
          this.deletePlayerModalVisible = false;
        },
        changeUserStatus(playerId) {
            fetchGETHeader(`users/${playerId}/status`, this.$store.getters.currentUserToken)
                .then(() => {
                    this.users.find((user) => {
                        if (user.id === playerId) {
                            user.status = !user.status;
                            return true;
                        }
                        return false;
                    });
                })
                .catch((error) => handleFetchError(this.$store, error, "Could not update user!"));
        },
    },
    computed: {
        currentSelectedUserName() {
            if (!this.currentSelectedUserId) return '';
            let user = this.users.filter(user => user.id === this.currentSelectedUserId);
            return user.userName;
        },
        userInfoTable() {
            return [
                {
                    headerLabel: "Spielername",
                    cell: (user) => user.userName,
                },
                {
                    headerLabel: "Letzter Login",
                    cell: (user) => this.toDate(user.updatedAt),
                },
                {
                    headerLabel: "Freigeschaltet",
                    cell: 'inputUserActive',
                },
                {
                    headerLabel: "",
                    cell: 'buttonActivateUser',
                },
                {
                    headerLabel: "Anzahl Spiele",
                    cell: (user) => this.userGames[user.id],
                },
                {
                    headerLabel: "",
                    cell: 'buttonGameView',
                },
                {
                    headerLabel: "",
                    cell: 'buttonDeleteGames',
                },
                {
                  headerLabel: "",
                  cell: 'buttonDeleteUser',
                },
            ]
        }
    },
};
</script>

<style scoped>
.menu {
    position: relative;
    margin: auto;
}
</style>
