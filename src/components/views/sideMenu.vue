<template>
  <div>
    <custom-modal
        v-show="nextRoundModalVisible"
        name="nextRoundModal"
        @close="nextRoundModalVisible = false"
    >
      <template v-slot:header>{{$t('side_menu.dia_next_round')}}</template>
      <template v-slot:body
      >{{$t('side_menu.dia_next_round_info')}}
      </template
      >
      <template v-slot:footer>
        <custom-button style="width:150px" @click="nextRound"
        >{{$t('common.accept')}}
        </custom-button
        >
        <custom-button
            style="width:150px"
            @click="nextRoundModalVisible = false"
        >{{$t('common.cancel')}}
        </custom-button
        >
      </template>
    </custom-modal>
    <custom-modal
        v-show="errorModalVisible"
        name="errorModal"
        @close="mainMenu"
    >
      <template v-slot:header>{{$t('side_menu.dia_error')}}</template>
      <template v-slot:body>
        <span>{{$t('side_menu.dia_error_info')}}</span>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="mainMenu">
          {{$t('common.accept')}}
        </custom-button>
      </template>
    </custom-modal>
    <custom-modal
        v-show="prevRoundModalVisible"
        name="RevertRoundModal"
        @close="prevRoundModalVisible = false"
    >
      <template v-slot:header>{{$t('side_menu.dia_prev_round')}}</template>
      <template v-slot:body
      >{{$t('side_menu.dia_prev_round_info')}}
      </template
      >
      <template v-slot:footer>
        <custom-button style="width:150px" @click="revertRound"
        >{{$t('common.accept')}}
        </custom-button
        >
        <custom-button
            style="width:150px"
            @click="prevRoundModalVisible = false"
        >{{$t('common.cancel')}}
        </custom-button
        >
      </template>
    </custom-modal>
    <loading-modal v-show="gameIsLoading"/>
  </div>
  <div class="sidemenu">
    <lobby/>
    <nav>
      <ul>
        <custom-link :target="homeRoute" icon="home"/>
        <custom-link :target="financeRoute" icon="finance"/>
        <custom-link :target="keyFiguresRoute" icon="poll"/>
        <li>
          <hr>
        </li>
        <custom-link :target="orderRoute" icon="package-variant"/>
        <custom-link :target="exhaustRoute" icon="lightbulb-fluorescent-tube-outline"/>
        <custom-link :target="breakDiscRoute" icon="disc"/>
        <custom-link :target="breakLightRoute" icon="car-parking-lights"/>
        <custom-link :target="shockAbsorberRoute" icon="bottle-soda-classic-outline"/>
        <custom-link :target="humanResourceRoute" icon="account-group"/>
        <custom-link :target="jobMarketRoute" icon="account-search"/>
        <custom-link :target="conveyorRoute" icon="forklift"/>
        <custom-link :target="conveyorMarketRoute" icon="store-marker"/>
        <li>
          <hr>
        </li>
        <custom-link :target="informationRoute" icon="book-information-variant"/>
        <custom-link :target="organisationRoute" icon="bank-outline"/>
      </ul>
    </nav>
    <div>
      <div>
        <custom-button
            :disabled="!nextRoundAvailable"
            class="action-button"
            @click="nextRoundModalVisible = true"
        >
          {{$t("side_menu.next_round")}}
        </custom-button>
      </div>
      <div v-if="isAdmin">
        <custom-button
            :disabled="!nextRoundAvailable"
            class="action-button"
            @click="prevRoundModalVisible = true"
        >
          {{$t("side_menu.prev_round")}}
        </custom-button>
      </div>
      <table>
        <tbody>
        <tr>
          <td>
            {{$t("side_menu.round_num")}}:</td>
          <td>{{ roundNumber }}</td>
        </tr>
        <tr>
          <td>
            {{$t("side_menu.balance")}}:</td>
          <td>{{ toCurrency(balance) }}</td>
        </tr>
        <tr>
          <td>
            {{$t("side_menu.customer_satisfaction")}}:</td>
          <td>{{ customerSatisfaction }} %</td>
        </tr>
        </tbody>
      </table>
      <div>
        <custom-button
            class="action-button"
            @click="mainMenu">
          {{$t("side_menu.main_menu")}}
        </custom-button>
      </div>
    </div>
    <div>
      <custom-local-switcher/>
    </div>
  </div>
</template>

<script>
import CustomLink from "../custom/Custom-Link.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import {mapGetters} from "vuex";
import Lobby from "../user/lobby";
import {closeWS} from "@/middleware/communication.handle";
import {toCurrency} from "@/functions/currency";
import LoadingModal from "../custom/Loading-Modal";
import CustomLocalSwitcher from "@/components/custom/Custom-Local-Switcher";

export default {
  components: {CustomLocalSwitcher, LoadingModal, Lobby, CustomLink, CustomButton, CustomModal},
  data() {
    return {
      nextRoundModalVisible: false,
      prevRoundModalVisible: false,
      errorModalVisible: false,
    };
  },
  methods: {
    toCurrency(value) {
      return toCurrency(value);
    },
    nextRound() {
      this.nextRoundModalVisible = false;
      this.nextRoundAvailable = false;
      const timeout = setTimeout(() => {
        this.$store.dispatch('setGameIsLoading', {gameIsLoading: false});
        this.errorModalVisible = true;
      }, 120000);
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setGame") {
          clearTimeout(timeout);
          this.nextRoundAvailable = true;
          this.$router.push('/game');
        }
      });
      this.$store.dispatch("nextRound", {
        gameId: this.gameId,
      });
    },
    mainMenu() {
      closeWS();
      this.$store.dispatch("removeCurrentGame");
      this.$router.push("/");
    },
    revertRound() {
      this.prevRoundModalVisible = false;
      this.nextRoundAvailable = false;
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setGame") {
          this.nextRoundAvailable = true;
        }
      });
      this.$store.dispatch("revertRound", {
        gameId: this.gameId,
      });
    },
  },
  computed: {
    ...mapGetters({
      roundNumber: "roundNumber",
      balance: "balance",
      customerSatisfaction: "customerSatisfaction",
      gameId: "currentGameId",
      currentUser: "currentUser",
      gameIsLoading: "gameIsLoading",
    }),
    nextRoundAvailable: {
      get() {
        return !this.gameIsLoading;
      },
      set(newValue) {
        this.$store.dispatch('setGameIsLoading', {gameIsLoading: !newValue});
      }
    },
    isAdmin() {
      return this.currentUser.role === 'admin';
    },
    orderRoute() {return {title: this.$t("side_menu.orderOverview"), route: "order"}},
    exhaustRoute() {return {title: this.$t("side_menu.exhaust"), route: "article", params: {articleNumber: 100101}}},
    breakDiscRoute() { return {title: this.$t("side_menu.break_disk"), route: "article", params: {articleNumber: 100102}}},
    breakLightRoute() { return {title: this.$t("side_menu.taillight"), route: "article", params: {articleNumber: 100103}}},
    shockAbsorberRoute(){ return {title: this.$t("side_menu.shock_absorber"), route: "article", params: {articleNumber: 100104}}},
    humanResourceRoute() { return {title: this.$t("side_menu.human_resource"), route: "employee"}},
    jobMarketRoute() { return {title: this.$t("side_menu.job_market"), route: "job_market"}},
    conveyorRoute() { return {title: this.$t("side_menu.conveyor"), route: "conveyor"}},
    conveyorMarketRoute() { return {title: this.$t("side_menu.conveyor_market"), route: "conveyor_market"}},
    informationRoute() { return {title: this.$t("side_menu.information_technology"), route: "technology"}},
    organisationRoute() { return {title: this.$t("side_menu.organization"), route: "orga"}},
    homeRoute() { return {title: this.$t("side_menu.home"), route: "info"}},
    financeRoute() { return {title: this.$t("side_menu.finance"), route: "finance"}},
    keyFiguresRoute() { return {title: this.$t("side_menu.key_figures"), route: "keyfigures"}}
  },
};
</script>

<style scoped>
.sidemenu {
  width: 16rem;
  min-width: 16rem;
  height: calc(100vh - 10px);
  z-index: 1;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  /* box-shadow */
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.action-button {
  width: 80%;
}

table {
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  width: 100%;
}

hr {
  display: block;
  border: 0;
  border-top: 1px solid #f1f1f1;
}

ul {
  list-style-type: none;
  padding-inline-start: 0;
}
</style>
