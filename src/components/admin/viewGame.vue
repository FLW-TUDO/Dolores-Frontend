<template>
  <div>
    <custom-modal
        v-show="modalVisible"
        name="deleteUserGame"
        @close="modalVisible = false"
    >
      <template v-slot:header>Spiel löschen?</template>
      <template v-slot:body>
        <span>Willst du wirklich das Spiele des Spielers {{ userName }} löschen?</span>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="deleteGame()">
          Bestätigen
        </custom-button>
        <custom-button style="width:150px" @click="modalVisible = false">
          Abbrechen
        </custom-button>
      </template>
    </custom-modal>
  </div>
  <div>
    <h1>Spiele von {{ userName }}</h1>
    <container>
      <custom-table :columns="gamesInfoTable" :items="gameInformationData">
        <template #tableGameInformation="slotProps">
          <container>
            <custom-rotated-table :items="[slotProps.item]" :rows="gameInfoTable"
                                  title="Spiel Informationen"/>
          </container>
        </template>
        <template #graphicBalance="slotProps" >
          <div class="center" v-if="gameBalanceData[slotProps.item.id]">
            <custom-chart :input="gameBalanceData[slotProps.item.id]"
                          :id="`balanceChart-${slotProps.index}`"
                          style="width: 400px" type="line" label="Kontostand"/>
          </div>
          <div class="center" v-else>
            <custom-button @click="fetchGameStatistics(slotProps.item.id)">Show</custom-button>
          </div>
        </template>
        <template #graphicCustomerSatisfaction="slotProps">
          <div class="center" v-if="gameSatisfactionData[slotProps.item.id]">
            <custom-chart :input="gameSatisfactionData[slotProps.item.id]"
                          :id="`satisfactionChart-${slotProps.index}`"
                          style="width: 400px" type="line" label="Kundenzufriedenheit"/>
          </div>
          <div v-else></div>

        </template>
        <template #functions="slotProps">
          <div class="flex">
            <custom-button :disabled="loading" @click="loadGame(slotProps.item.id)">Spiel laden
            </custom-button>
            <custom-button @click="exportGame(slotProps.item.id)">Export</custom-button>
            <custom-button @click="openModal(slotProps.item.id)">Löschen</custom-button>
            <custom-button @click="downloadGame(slotProps.item.id)">Download</custom-button>
          </div>
        </template>
      </custom-table>
    </container>
  </div>
</template>

<script>
import CustomButton from "../custom/Custom-Button.vue";
import Container from "../custom/Custom-Container.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import moment from "moment";
import CustomTable from "../custom/Custom-Table.vue";
import CustomRotatedTable from "../custom/Custom-Rotated-Table.vue";
import {fetchDELETEHeader, fetchGETHeader} from "@/middleware/communication.handle";
import {handleFetchError} from "@/middleware/errorHandler";
import {toCurrency} from "@/functions/currency";
import CustomChart from "../custom/Custom-Chart";


export default {
  props: ["userId"],
  components: {CustomButton, Container, CustomTable, CustomRotatedTable, CustomModal, CustomChart},
  data() {
    return {
      games: [],
      gameBalanceData: {},
      gameInformationData: [],
      gameSatisfactionData: {},
      userName: undefined,
      loading: false,
      modalVisible: false,
      currentSelectedGameId: undefined,
      balanceImageUrl: {},
      satisfactionImageUrl: {},
    };
  },
  created() {
    if (this.userId === undefined) return;
    fetchGETHeader(`gameInfos/user/${this.userId}`, this.$store.getters.currentUserToken)
        .then(async (games) => {
          this.games = games
          console.log(games)
          if (games.length > 0) {
            const infos = this.games.map(it => {
              return this.fetchGameInfos(it.id)
            });

            this.gameInformationData = await Promise.all(infos);

            this.gameInformationData.sort((a, b) => {
              let time_a = new moment(String(a['updatedAt']), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
              let time_b = new moment(String(b['updatedAt']), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("YYYYMMDDHHmm");
              return time_b - time_a
            })
            this.fetchGameStatistics(this.gameInformationData[0].id)


          }
        })
        .catch((error) => handleFetchError(this.$store, error, "Could not fetch all user games!"));

    fetchGETHeader(`users/${this.userId}`, this.$store.getters.currentUserToken)
        .then((data) => {
          this.userName = data.userName
        })
        .catch((error) => handleFetchError(this.$store, error, "Could not fetch user name!"));
  },
  methods: {
    fetchGameStatistics(gameId) {
      fetchGETHeader(`gameInfos/${gameId}/statisiticsinfo`, this.$store.getters.currentUserToken)
          .then(data => {
            this.gameBalanceData[gameId] = {
              'data': data.balances,
              'labels': data.labels,
            }
            this.gameSatisfactionData[gameId] = {
              'data': data.satisfaction,
              'labels': data.labels,
            }
          }).catch((error) => handleFetchError(this.$store, error, "Error during loading game statistics!"));
    },
    fetchGameInfos(gameId) {
      return fetchGETHeader(`gameInfos/${gameId}/information`, this.$store.getters.currentUserToken)
          .then(data => {
            return {
              'id' : gameId,
              'gameName' : data.gameName,
              'roundNumber': data.roundNumber,
              'balance': data.balance,
              'satisfaction': data.satisfaction,
              'createdAt' : data.createdAt,
              'updatedAt' : data.updatedAt,
            }
          }).catch((error) => handleFetchError(this.$store, error, "Error during loading game informations!"));
    },
    toCurrency(value) {
      return toCurrency(value);
    },
    openModal(gameId) {
      this.currentSelectedGameId = gameId;
      this.modalVisible = true;
    },
    toDate(input) {
      return moment(String(input), 'YYYY-MM-DD[T]HH:mm:ss.SSS').format("HH:mm DD.MM.YYYY");
    },
    deleteGame() {
      if (this.currentSelectedGameId === undefined) return;
      let gameId = this.currentSelectedGameId;
      fetchDELETEHeader(`gameInfos/${gameId}`, this.$store.getters.currentUserToken)
          .then(() => {
            this.games = this.games.filter((game) => game.id !== gameId)
          })
          .catch((error) => handleFetchError(this.$store, error, "Could not delete user game!"));
      this.currentSelectedGameId = undefined;
      this.modalVisible = false;
    },
    loadGame(gameId) {
      this.loading = true;
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setGame") this.$router.push("/game");
      });
      this.$store.dispatch("loadGame", {gameId: gameId});
    },
    exportGame(gameId) {
      fetchGETHeader(`gameInfos/${gameId}/export`, this.$store.getters.currentUserToken)
          .then((data) => {
            const anchor = document.createElement("a");
            anchor.href = data.file;
            anchor.target = "_blank";
            anchor.download = `export_${gameId}.csv`;
            anchor.click();
          })
          .catch((error) => handleFetchError(this.$store, error, "Could not export game!"));
    },
    downloadGame(gameId) {
      fetchGETHeader(`gameInfos/${gameId}/download`, this.$store.getters.currentUserToken)
          .then((data) => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const anchor = document.createElement("a");
            anchor.href = dataStr;
            anchor.target = "_blank";
            anchor.download = `${gameId}.json`;
            anchor.click();
          })
          .catch((error) => handleFetchError(this.$store, error, "Could not download game!"));
    }
  },
  computed: {
    gamesInfoTable() {
      return [
        {
          headerLabel: "Information",
          cell: 'tableGameInformation',
        },
        {
          headerLabel: "Kontostand",
          cell: 'graphicBalance',
        },
        {
          headerLabel: "Kundenzufriedenheit",
          cell: 'graphicCustomerSatisfaction',
        },
        {
          headerLabel: "Aktionen",
          cell: 'functions',
        },
      ]
    },
    gameInfoTable() {
      return [
        {
          headerLabel: "Spielname",
          cell: (game) => game.gameName,
        },
        {
          headerLabel: "Rundennummer",
          cell: (game) => game.roundNumber,
        },
        {
          headerLabel: "Kontostand",
          cell: (game) => this.toCurrency(game.balance),
        },
        {
          headerLabel: "Kundenzufriedenheit",
          cell: (game) => `${game.satisfaction} %`,
        },
        {
          headerLabel: "Erstellungsdatum",
          cell: (game) => {
            return this.toDate(game.createdAt)
          },
        },
        {
          headerLabel: "Letztes Update",
          cell: (game) => this.toDate(game.updatedAt),
        },
      ]
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
