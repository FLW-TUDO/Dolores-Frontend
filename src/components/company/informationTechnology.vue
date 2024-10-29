<template>
  <div>
    <custom-modal
        v-show="modalVisible"
        name="technologyModal"
        @close="modalVisible = false"
    >
      <template v-slot:header>{{ currentSelectedName }}</template>
      <template v-slot:body>
        <p v-html="$t('company.dia_information', {money:toCurrency(currentSelectedITCost), durationBasic:currentSelectedRevertDurationBasic, durationL1:currentSelectedRevertDurationLVL1, durationL2:currentSelectedRevertDurationLVL2})"></p>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="changeTechnology()">
          {{$t('common.accept')}}
        </custom-button>
        <custom-button style="width:150px" @click="modalVisible = false">
          {{$t('common.cancel')}}
        </custom-button>
      </template>
    </custom-modal>
  </div>
  <div>
    <div class="box">
      <header>
        <h1>{{$t('company.information_technology')}}</h1>
      </header>
      <container>
<!--        <h3>{{$t('company.current_system')}}</h3>-->
<!--        <span><b>{{$t('company.no_change_possible')}}</b></span><br>-->
<!--        <span>{{$t('company.round_cost', {money:toCurrency(itcosts)})}}</span>-->
<!--        <div class="radio-center">-->
<!--          <custom-button-->
<!--              v-for="(technology, index) in technologies"-->
<!--              :key="technology"-->
<!--              :disabled="getTechButtonDisabled(index)"-->
<!--              class="custom-button"-->
<!--              @click="openModal(index)"-->
<!--          >-->
<!--            {{ technology }}-->
<!--          </custom-button>-->
<!--        </div>-->

<!--        <h3>{{$t('company.additional_modules')}}</h3>-->
<!--        <span><b>{{$t('company.no_change_possible')}}</b></span><br>-->

<!--        <div class="radio-center">-->
<!--          <div v-for="(service, index) in services" :key="service">-->
<!--            <input-->
<!--                v-model="checkedService"-->
<!--                :disabled="itButtonDisabled"-->
<!--                :value="index"-->
<!--                type="checkbox"-->
<!--            />-->
<!--            <label>{{ service }}</label>-->
<!--          </div>-->
<!--        </div>-->
        <h3>{{$t('company.loading_equipment_condition')}}</h3>
        <div class="radio-center">
          <div v-for="(condition, index) in conditions" :key="condition">
            <input
                v-model="chosenCondition"
                :value="index"
                name="condition"
                type="radio"
            />
            <label>{{ condition }}</label>
          </div>
        </div>
      </container>
    </div>
  </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
  components: {Container, CustomButton, CustomModal},
  data() {
    return {
      modalVisible: false,
      currentSelection: undefined,
      chosenConditionTimeout: undefined,
      checkedServiceTimeout: undefined,
      conditions : [this.$t('company.leConditions_1'), this.$t('company.leConditions_2'), this.$t('company.leConditions_3'), ],
      technologies: [this.$t('company.technology_1'),this.$t('company.technology_2'),this.$t('company.technology_3'),this.$t('company.technology_4')],
      services: [this.$t('company.service_1'),this.$t('company.service_2'),this.$t('company.service_3'),this.$t('company.service_4'),this.$t('company.service_5')],
    }
  },
  methods: {
    openModal(buttonId) {
      this.currentSelection = buttonId;
      this.modalVisible = true;
    },
    toCurrency(value) {
      return toCurrency(value);
    },
    getTechButtonDisabled(buttonId) {
      // always return true to disable
      return buttonId > -1;
      // TODO: create idea for real usage of these technologies
      // switch (buttonId) {
      //   case 0:
      //     return this.itcosts === this.technologyCost[0] || this.$store.getters.backToBasic !== 0;
      //   case 1:
      //     return this.itcosts === this.technologyCost[1] || this.$store.getters.backToLVL1 !== 0;
      //   case 2:
      //     return this.itcosts === this.technologyCost[2] || this.$store.getters.backToLVL2 !== 0;
      //   case 3:
      //     return this.itcosts === this.technologyCost[3];
      // }
    },
    changeTechnology() {
      this.modalVisible = false;
      this.$store.dispatch("changeTechnology", {
        stateId: this.stateId,
        technology: this.currentSelection,
      });
      this.currentSelection = undefined;
    },
  },
  computed: {
    ...mapGetters({
      stateId: "currentStateId",
      itcosts: "itcosts",
      occStocks: "occStocks",
      leConditionsCosts: "leConditionsCosts",
      technologyCost: "technologyCost",
      revertDuration: "revertDuration",
    }),
    currentSelectedName() {
      if (this.currentSelection === undefined) return;
      return this.technologies[this.currentSelection];
    },
    currentSelectedITCost() {
      if (this.currentSelection === undefined) return;
      return this.technologyCost[this.currentSelection];
    },
    currentSelectedRevertDurationBasic() {
      if (this.currentSelection === undefined) return;
      return this.revertDuration[this.currentSelection][0]
    },
    currentSelectedRevertDurationLVL1() {
      if (this.currentSelection === undefined) return;
      return this.revertDuration[this.currentSelection][1]
    },
    currentSelectedRevertDurationLVL2() {
      if (this.currentSelection === undefined) return;
      return this.revertDuration[this.currentSelection][2]
    },
    itButtonDisabled() {
      return this.itcosts === 0;
    },
    chosenCondition: {
      get() {
        const options = this.$store.getters.leConditionsCosts;
        let cost = this.$store.getters.loadingEquipmentLevel;
        return options.indexOf(cost);
      },
      set(newValue) {
        if (this.chosenConditionTimeout !== undefined)
          clearTimeout(this.chosenConditionTimeout);
        this.chosenConditionTimeout = setTimeout(() => {
          let cost = this.$store.getters.leConditionsCosts[newValue];
          this.$store.dispatch("changeLoadingEquipmentLevel", {
            stateId: this.stateId,
            conditionCost: cost,
          });
          this.chosenConditionTimeout = undefined;
        }, 1000);
      },
    },
    checkedService: {
      get() {
        let serviceStatus = [
          this.$store.getters.orderQuantity,
          this.$store.getters.reorderLevel,
          this.$store.getters.safetyStock,
          this.$store.getters.statusReport,
          this.$store.getters.lookInStorage,
        ];
        let activatedServices = [];
        for (let i = 0; i < serviceStatus.length; i++) {
          if (serviceStatus[i]) {
            activatedServices.push(i);
          }
        }
        return activatedServices;
      },
      set(newValue) {
        this.$store.dispatch("updateServices", {services: newValue});
        if (this.checkedServiceTimeout !== undefined)
          clearTimeout(this.checkedServiceTimeout);
        this.checkedServiceTimeout = setTimeout(() => {
          this.$store.dispatch("changeServices", {
            stateId: this.stateId,
            services: newValue,
          });
          this.checkedServiceTimeout = undefined;
        }, 1000);

      },
    },
  },
};
</script>

<style scoped>
.radio-center {
  text-align: left;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  justify-content: center;
  align-content: center;
}

.custom-button {
  width: 60%;
}

.radio-center input[type="radio"] {
  vertical-align: baseline;
}

.box {
  display: grid;
  grid-template-rows: 5rem 90vh;
  justify-content: center;
}
</style>
