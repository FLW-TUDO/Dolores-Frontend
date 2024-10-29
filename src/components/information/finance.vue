<template>
  <div class="main">
    <header>
      <h1>{{$t('finance.finance')}}</h1>
    </header>
    <container>
      <table>
        <tr>
          <td>{{$t('finance.starting_balance')}} {{ roundNumber - 1 }}</td>
          <td>{{ oldBalance }}</td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="horizontal-line"></div>
            <br/>
          </td>
        </tr>
        <tr>
          <td>{{$t('finance.orders')}}</td>
          <td>{{ orderBalance }}</td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="horizontal-line"></div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(salesIncome) }}</td>
          <td>{{$t('finance.income_sales')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-orderCosts) }}</td>
          <td>{{$t('finance.expenses_sales')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-storageCost) }}</td>
          <td>{{$t('finance.expenses_storage')}}</td>
        </tr>
        <tr>
          <td><br/></td>
        </tr>
        <tr>
          <td>{{$t('finance.human_resource')}}</td>
          <td>{{ staffBalance }}</td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="horizontal-line"></div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-worktimeCost) }}</td>
          <td>{{$t('finance.expenses_salaries')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-costsQualificationMeasure) }}</td>
          <td>{{$t('finance.expenses_training')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-costsNewEmployees) }}</td>
          <td>{{$t('finance.expenses_personnel')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-workClimateInvestment) }}</td>
          <td>{{$t('finance.expenses_work_climate')}}</td>
        </tr>
        <tr>
          <td><br/></td>
        </tr>
        <tr>
          <td>{{$t('finance.technology')}}</td>
          <td>
            {{ technicBalance }}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="horizontal-line"></div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-itcosts) }}</td>
          <td>{{$t('finance.expenses_it')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(incomeConveyorSale) }}</td>
          <td>{{$t('finance.income_conveyor_sales')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ conveyorBalance }}</td>
          <td>{{$t('finance.expenses_maintenance')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-costsNew) }}</td>
          <td>{{$t('finance.expenses_conveyor_purchase')}}</td>
        </tr>
        <tr>
          <td><br/></td>
        </tr>
        <tr>
          <td>{{$t('finance.organization')}}</td>
          <td>{{ orgaBalance }}</td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="horizontal-line"></div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-costsUSD) }}</td>
          <td>{{$t('finance.expenses_loading_sec')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ toCurrency(-costsABC) }}</td>
          <td>{{$t('finance.expenses_abc')}}</td>
        </tr>
        <tr>
          <td><br/></td>
        </tr>
        <tr>
          <td>{{$t('finance.interest')}}</td>
          <td>{{ interestBalance }}</td>
        </tr>
        <tr>
          <td>{{$t('finance.end_balance')}} {{ roundNumber - 1 }}</td>
          <td>{{ toCurrency(balance) }}</td>
        </tr>
      </table>
    </container>
  </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import {toCurrency} from "@/functions/currency";
import {mapGetters} from "vuex";

export default {
  components: {Container},
  methods: {
    toCurrency(value) {
      return toCurrency(value);
    }
  },
  computed: {
    ...mapGetters({
      roundNumber: "roundNumber",
      balance: "balance",
      salesIncome: "salesIncome",
      orderCosts: "orderCosts",
      storageCost: "storageCost",
      worktimeCost: "worktimeCost",
      costsQualificationMeasure: "costsQualificationMeasure",
      costsNewEmployees: "costsNewEmployees",
      workClimateInvestment: "workClimateInvestment",
      incomeConveyorSale: "incomeConveyorSale",
      itcosts: "itcosts",
      costsMaintenance: "costsMaintenance",
      costsOverhaul: "costsOverhaul",
      costsRepair: "costsRepair",
      costsNew: "costsNew",
      costsUSD: "costsUSD",
      costsABC: "costsABC",
      debitInterestCost: "debitInterestCost",
      creditInterestCost: "creditInterestCost",
      prevBalance: "oldBalance",
    }),
    oldBalance() {
      if (this.roundNumber === 11)
        return toCurrency(this.balance - this.creditInterestCost + this.debitInterestCost +
            this.worktimeCost + this.costsQualificationMeasure + this.costsNewEmployees +
            this.workClimateInvestment - this.incomeConveyorSale + this.itcosts +
            this.costsMaintenance + this.costsOverhaul + this.costsRepair + this.costsNew +
            this.costsUSD + this.costsABC - this.salesIncome + this.orderCosts + this.storageCost);
      else
        return toCurrency(this.prevBalance);
    },
    orderBalance() {
      return toCurrency(this.salesIncome - this.orderCosts - this.storageCost);
    },
    interestBalance() {
      return toCurrency(this.creditInterestCost - this.debitInterestCost);
    },
    staffBalance() {
      return toCurrency(-this.worktimeCost - this.costsQualificationMeasure - this.costsNewEmployees - this.workClimateInvestment);
    },
    technicBalance() {
      return toCurrency(this.incomeConveyorSale - this.itcosts - this.costsMaintenance - this.costsOverhaul - this.costsRepair - this.costsNew);
    },
    conveyorBalance() {
      return toCurrency(-this.costsMaintenance - this.costsOverhaul - this.costsRepair);
    },
    orgaBalance() {
      return toCurrency(-this.costsUSD - this.costsABC);
    }
  },
};
</script>

<style scoped>
.horizontal-line {
  border-top: 1px solid #eeeeee;
}

table {
  text-align: left;
}
</style>