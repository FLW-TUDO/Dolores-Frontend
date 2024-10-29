<template>
    <div class="menu-button">
        <custom-button @click="back">{{$t('common.back')}}</custom-button>
    </div>
    <div>
        <h1>{{$t('load_game.load_game')}}</h1>
        <container>
            <custom-table :columns="gamesInfoTable" :items="gameInformationData">
                <template #buttonLoadGame="slotProps">
                    <custom-button :disabled="loading" @click="loadGame(slotProps.item.id)">
                      {{$t('load_game.load_game')}}
                    </custom-button>
                </template>
            </custom-table>
        </container>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";
import CustomButton from "../custom/Custom-Button.vue";
import Container from "../custom/Custom-Container.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {fetchGETHeader} from "@/middleware/communication.handle";
import {handleFetchError} from "@/middleware/errorHandler";
import {toCurrency} from "@/functions/currency";

export default {
    components: {CustomButton, Container, CustomTable},
    data() {
        return {
            currentGames: [],
            gameInformationData : [],
            loading: false,
        };
    },
    created() {
        fetchGETHeader(`gameInfos/user/${this.currentUser._id}`, this.$store.getters.currentUserToken)
            .then(async (data) => {
              this.currentGames = data;
              const infos = this.currentGames.map(game => {
                return this.fetchGameInfos(game.id)
              })

              this.gameInformationData = await Promise.all(infos);
              this.gameInformationData.sort((a,b) => {
                let time_a = new moment(String(a['updatedAt']), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
                let time_b = new moment(String(b['updatedAt']), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
                return time_b - time_a
              })
            })
            .catch((error) => handleFetchError(this.$store, error, "Could not load games."));
    },
    methods: {
        fetchGameInfos(gameId) {
          return fetchGETHeader(`gameInfos/${gameId}/information`, this.$store.getters.currentUserToken)
              .then(data => {
                return {
                  'id': gameId,
                  'gameName': data.gameName,
                  'roundNumber': data.roundNumber,
                  'balance': data.balance,
                  'satisfaction': data.satisfaction,
                  'createdAt': data.createdAt,
                  'updatedAt': data.updatedAt,
                }
              }).catch((error) => handleFetchError(this.$store, error, "Error during loading game informations!"));
        },
        toCurrency(value) {
            return toCurrency(value);
        },
        toDate(input) {
            return new moment(String(input), "YYYY-MM-DD[T]HH:mm:ss.SSS").format("HH:mm DD.MM.YYYY");
        },
        loadGame(gameId) {
            this.loading = true;
            this.$store.subscribe((mutation) => {
                if (mutation.type === "setGame") this.$router.push("/game");
            });
            this.$store.dispatch("loadGame", {gameId: gameId});
        },
        back() {
            this.$router.back()
        },
    },
    computed: {
        ...mapGetters({
            currentUser: "currentUser",
        }),
        gamesInfoTable() {
            return [
                {
                    headerLabel: this.$t('load_game.game_name'),
                    cell: (game) => game.gameName,
                },
                {
                    headerLabel: this.$t('load_game.game_round'),
                    cell: (game) => game.roundNumber,
                },
                {
                    headerLabel: this.$t('load_game.balance'),
                    cell: (game) => this.toCurrency(game.balance),
                },
                {
                    headerLabel: this.$t('load_game.created_at'),
                    cell: (game) => this.toDate(game.createdAt),
                },
                {
                    headerLabel: this.$t('load_game.last_action'),
                    cell: (game) => this.toDate(game.updatedAt),
                },
                {
                    headerLabel: "",
                    cell: 'buttonLoadGame',
                },
            ]
        }
    },
};
</script>

<style scoped>
.menu-button {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: absolute;
    width: 12rem;
    left: 0;
    top: 0;
}
</style>
