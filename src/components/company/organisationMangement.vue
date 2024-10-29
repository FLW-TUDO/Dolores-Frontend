<template>
  <div>
    <custom-modal
        v-show="analysisModalVisible"
        name="abcAnalysisModal"
        @close="analysisModalVisible = false"
    >
      <template v-slot:header>{{$t('company.dia_abc')}}</template>
      <template v-slot:body>
        <p v-html="$t('company.dia_abc_info', {money:toCurrency(abcAnalysisCost)})"/>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="initiateABCAnalysis()">
          {{$t('common.accept')}}
        </custom-button>
        <custom-button style="width:150px" @click="analysisModalVisible = false">
          {{$t('common.cancel')}}
        </custom-button>
      </template>
    </custom-modal>
    <custom-modal
        v-show="analysisResolutionModalVisible"
        name="abcAnalysisResolutionModal"
        @close="analysisResolutionModalVisible = false"
    >
      <template v-slot:header>{{$t('company.dia_abc_result')}}</template>
      <template v-slot:body>
        <custom-table :columns="abcAnalysisResultsTable" :items="articleDynamics"/>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="analysisResolutionModalVisible = false">
          {{$t('common.ok')}}
        </custom-button>
      </template>
    </custom-modal>
    <custom-modal
        v-show="zoningModalVisible"
        name="abcZoningModal"
        @close="zoningModalVisible = false"
    >
      <template v-slot:header>{{ $t('company.dia_zoning') }}</template>
      <template v-slot:body>
        <p v-html="$t('company.dia_zoning_info', {money:toCurrency(abcZoningCost)})"/>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="initiateABCZoning()">
          {{ $t('common.accept') }}
        </custom-button>
        <custom-button style="width:150px" @click="zoningModalVisible = false">
          {{ $t('common.cancel') }}
        </custom-button>
      </template>
    </custom-modal>
  </div>
  <div class="box">
    <header>
      <h1>{{$t('company.organization')}}</h1>
    </header>
    <container :title="$t('company.goods_receipt')">
      <h3>{{$t('company.product_control')}}</h3>
      <div class="radio-center">
        <div v-for="(level, index) in inboundProductControl" :key="level">
          <input
              v-model="inboundPalletControl"
              :value="palletControlFactor[index]"
              name="incLevel"
              type="radio"
          />
          <label>{{ level }}</label>
        </div>
      </div>
      <div>
        <h3>{{$t('company.control_time')}}</h3>
        <p v-html="$t('company.control_time_incoming')"/>
      </div>

      <h3>{{$t('company.loading_equipment_prot')}}</h3>
      <div class="radio-center">
        <div
            v-for="(protection, index) in loadUnitProtection"
            :key="protection"
        >
          <input
              v-model="unitSecurityDevicesUsed"
              :value="index === 0"
              name="protection"
              type="radio"
          />
          <label>{{ protection }}</label>
        </div>
      </div>
      <div>
        <p v-html="$t('company.le_cost', {money : toCurrency(12)})"/>
      </div>
    </container>
    <container :title="$t('company.storage')">
      <h3>{{$t('company.strategy_for_storing')}}</h3>
      <div class="radio-center">
        <div v-for="(strategy, index) in storageStrategies" :key="strategy">
          <input
              v-model="incomingStrategy"
              :value="index"
              name="storageStrategies"
              type="radio"
          />
          <label>{{ strategy }}</label>
        </div>
      </div>

      <h3>{{$t('company.strategy_for_allocation')}}</h3>
      <div class="radio-center">
        <div
            v-for="(strategy, index) in spaceAllocationStrategies"
            :key="strategy"
        >
          <input
              v-model="storageStrategy"
              :disabled="storageStrategyInputDisabled(index)"
              :value="index"
              name="spaceAllocationStrategies"
              type="radio"
          />
          <label>{{ strategy }}</label>
        </div>
      </div>
      <div class="radio-center">
        <custom-button
            :disabled="canNotInitiateABCAnalysis"
            @click="analysisModalVisible = true"
        >
          {{$t('company.abc_analysis')}}
        </custom-button>
        <custom-button
            :disabled="!isABCReady"
            @click="analysisResolutionModalVisible = true">
          {{$t('company.abc_results')}}
        </custom-button>
        <custom-button
            :disabled="!isABCReady"
            @click="zoningModalVisible = true"
        >
          {{$t('company.abc_zoning')}}
        </custom-button>
      </div>

      <h3>{{$t('company.strategy_for_picking')}}</h3>
      <div class="radio-center">
        <div v-for="(strategy, index) in outsourcingStrategies" :key="strategy">
          <input
              v-model="outboundStrategy"
              :value="index"
              name="outsourcingStrategies"
              type="radio"
          />
          <label>{{ strategy }}</label>
        </div>
      </div>
      <h3>{{$t('company.capacity_distribution')}}</h3>
      <div class="grid">
        <span><b>{{$t('company.storing')}}</b></span>
        <span><b>{{$t('company.removal')}}</b></span>
        <custom-input v-model.lazy="capacityDistribution" type="number"/>
        <span>{{ 100 - capacityDistribution }} %</span>
      </div>
    </container>
    <container :title="$t('company.outgoing_goods')">
      <h3>{{$t('company.product_control')}}</h3>
      <div class="radio-center">
        <div v-for="(strategy, index) in outProductControl" :key="strategy">
          <input
              v-model="outboundPalletControl"
              :value="palletControlFactor[index]"
              name="outProductControl"
              type="radio"
          />
          <label>{{ strategy }}</label>
        </div>
      </div>
      <div>
        <h3>{{$t('company.control_time')}}</h3>
        <p v-html="$t('company.control_time_outgoing')"/>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomInput from "../custom/Custom-Input.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
  components: {Container, CustomButton, CustomInput, CustomModal, CustomTable},
  data() {
    return {
      analysisModalVisible: false,
      analysisResolutionModalVisible: false,
      zoningModalVisible: false,
      capacityDistributionTimeout: undefined,
      incomingStrategyTimeout: undefined,
      inboundPalletControlTimeout: undefined,
      outboundPalletControlTimeout: undefined,
      unitSecurityDevicesUsedTimeout: undefined,
      storageStrategyTimeout: undefined,
      outboundStrategyTimeout: undefined,
      inboundProductControl: [this.$t('company.control_level_1'),this.$t('company.control_level_2'),this.$t('company.control_level_3'),this.$t('company.control_level_4'),this.$t('company.control_level_5')],
      loadUnitProtection : [this.$t('company.le_protection_1'), this.$t('company.le_protection_2'),],
      storageStrategies: [this.$t('company.storage_strategy_1'), this.$t('company.storage_strategy_2')],
      spaceAllocationStrategies : [this.$t('company.strategy_allocation_1'), this.$t('company.strategy_allocation_2'), this.$t('company.strategy_allocation_3'),],
      outsourcingStrategies: [this.$t('company.strategy_picking_1'), this.$t('company.strategy_picking_2'), this.$t('company.strategy_picking_3'), this.$t('company.strategy_picking_4'),],
      outProductControl: [this.$t('company.control_level_1'),this.$t('company.control_level_2'),this.$t('company.control_level_3'),this.$t('company.control_level_4'),this.$t('company.control_level_5')]
    }
  },
  methods: {
    toCurrency(value) {
      return toCurrency(value);
    },
    storageStrategyInputDisabled(inputId) {
      switch (inputId) {
        case 2:
          return !this.isZoningReady;
        default:
          return false;
      }
    },
    initiateABCAnalysis() {
      this.analysisModalVisible = false;
      this.$store.dispatch("initiateABCAnalysis", {
        stateId: this.stateId,
      });
    },
    initiateABCZoning() {
      this.zoningModalVisible = false;
      this.$store.dispatch("initiateABCAnalysis", {
        stateId: this.stateId,
      });
    },
  },
  computed: {
    ...mapGetters({
      stateId: "currentStateId",
      palletControlFactor: "palletControlFactor",
      abcAnalysisRound: "abcAnalysisRound",
      roundNumber: "roundNumber",
      abcZoningRound: "abcZoningRound",
      abcAnalysisCost: "abcAnalysisCost",
      abcZoningCost: "abcZoningCost",
      articleDynamics: "articleDynamics",
    }),
    isABCReady() {
      return (
          this.abcAnalysisRound !== 0 && this.abcAnalysisRound < this.roundNumber
      );
    },
    canNotInitiateABCAnalysis() {
      return this.abcAnalysisRound >= this.roundNumber;
    },
    isZoningReady() {
      return (
          this.abcZoningRound !== 0 && this.abcAnalysisRound < this.roundNumber
      );
    },
    capacityDistribution: {
      get() {
        return Math.round(this.$store.getters.capacityDistribution * 100);
      },
      set(newValue) {
        if (newValue >= 1 && newValue <= 99) {
          if (this.capacityDistributionTimeout !== undefined)
            clearTimeout(this.capacityDistributionTimeout);
          this.capacityDistributionTimeout = setTimeout(() => {
            this.$store.dispatch("changeCapacityDistribution", {
              stateId: this.stateId,
              distribution: newValue / 100,
            });
            this.capacityDistributionTimeout = undefined;
          }, 1000);
        }
      },
    },
    incomingStrategy: {
      get() {
        return this.$store.getters.incomingStrategy;
      },
      set(newValue) {
        if (this.incomingStrategyTimeout !== undefined)
          clearTimeout(this.incomingStrategyTimeout);
        this.incomingStrategyTimeout = setTimeout(() => {
          this.$store.dispatch("changeIncomingStrategy", {
            stateId: this.stateId,
            strategy: newValue,
          });
          this.incomingStrategyTimeout = undefined;
        }, 1000);
      },
    },
    inboundPalletControl: {
      get() {
        return this.$store.getters.inboundPalletControl;
      },
      set(newValue) {
        if (this.inboundPalletControlTimeout !== undefined)
          clearTimeout(this.inboundPalletControlTimeout);
        this.inboundPalletControlTimeout = setTimeout(() => {
          this.$store.dispatch("changeInboundControl", {
            stateId: this.stateId,
            control: newValue,
          });
          this.inboundPalletControlTimeout = undefined;
        }, 1000);
      },
    },
    outboundPalletControl: {
      get() {
        return this.$store.getters.outboundPalletControl;
      },
      set(newValue) {
        if (this.outboundPalletControlTimeout !== undefined)
          clearTimeout(this.outboundPalletControlTimeout);
        this.outboundPalletControlTimeout = setTimeout(() => {
          this.$store.dispatch("changeOutboundControl", {
            stateId: this.stateId,
            control: newValue,
          });
          this.outboundPalletControlTimeout = undefined;
        }, 1000);
      },
    },
    unitSecurityDevicesUsed: {
      get() {
        return this.$store.getters.unitSecurityDevicesUsed;
      },
      set(newValue) {
        if (this.unitSecurityDevicesUsedTimeout !== undefined)
          clearTimeout(this.unitSecurityDevicesUsedTimeout);
        this.unitSecurityDevicesUsedTimeout = setTimeout(() => {
          this.$store.dispatch("changeUnitSecurityDevices", {
            stateId: this.stateId,
            securityDevice: newValue,
          });
          this.unitSecurityDevicesUsedTimeout = undefined;
        }, 1000);
      },
    },
    storageStrategy: {
      get() {
        return this.$store.getters.storageStrategy;
      },
      set(newValue) {
        if (this.storageStrategyTimeout !== undefined)
          clearTimeout(this.storageStrategyTimeout);
        this.storageStrategyTimeout = setTimeout(() => {
          this.$store.dispatch("changeStorageStrategy", {
            stateId: this.stateId,
            strategy: newValue,
          });
          this.storageStrategyTimeout = undefined;
        }, 1000);
      },
    },
    outboundStrategy: {
      get() {
        return this.$store.getters.outboundStrategy;
      },
      set(newValue) {
        if (this.outboundStrategyTimeout !== undefined)
          clearTimeout(this.outboundStrategyTimeout);
        this.outboundStrategyTimeout = setTimeout(() => {
          this.$store.dispatch("changeOutboundStrategy", {
            stateId: this.stateId,
            strategy: newValue,
          });
          this.outboundStrategyTimeout = undefined;
        }, 1000);
      },
    },
    abcAnalysisResultsTable() {
      return [
        {
          headerLabel: this.$t('common.article_number'),
          cell: (dynamic) => dynamic.article.articleNumber,
        },
        {
          headerLabel: this.$t('common.article_name'),
          cell: (dynamic) => dynamic.article.name,
        },
        {
          headerLabel: this.$t('article.classification'),
          cell: (dynamic) => dynamic.article.abc_classification,
        },
      ];
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
  width: 40%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
}

.box {
  display: grid;
  grid-template-rows: 5rem 90vh;
  grid-template-columns: 1fr 1fr 1fr;
}

header {
  grid-column: span 3;
}
</style>
