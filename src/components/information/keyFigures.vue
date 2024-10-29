<template>
  <div class="main">
    <header>
      <h1>{{$t('keyfigures.keyfigures')}}</h1>
    </header>
    <container>
      <table>
        <thead>
        <tr>
          <th></th>
          <th colspan="2">{{$t('common.unloading')}}</th>
          <th colspan="2">{{$t('common.receipt_of_goods')}}</th>
          <th colspan="2">{{$t('common.storage')}}</th>
          <th colspan="2">{{$t('common.outgoing_goods_control')}}</th>
          <th colspan="2">{{$t('common.loading')}}</th>
        </tr>
        <tr>
          <td class="horizontal-line" colspan="11">
          </td>
        </tr>
        <tr>
          <th></th>
          <th>{{$t('keyfigures.prev_round')}}</th>
          <th>{{$t('keyfigures.current_round')}}</th>
          <th>{{$t('keyfigures.prev_round')}}</th>
          <th>{{$t('keyfigures.current_round')}}</th>
          <th>{{$t('keyfigures.prev_round')}}</th>
          <th>{{$t('keyfigures.current_round')}}</th>
          <th>{{$t('keyfigures.prev_round')}}</th>
          <th>{{$t('keyfigures.current_round')}}</th>
          <th>{{$t('keyfigures.prev_round')}}</th>
          <th>{{$t('keyfigures.current_round')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th class="vertical-line">{{$t('keyfigures.num_emp_wfp')}}</th>
          <td>{{ previousEmployeeWFP(0) }}</td>
          <td>{{ currentEmployeeWFP(0) }}</td>
          <td>{{ previousEmployeeWFP(1) }}</td>
          <td>{{ currentEmployeeWFP(1) }}</td>
          <td>{{ previousEmployeeWFP(2) }}</td>
          <td>{{ currentEmployeeWFP(2) }}</td>
          <td>{{ previousEmployeeWFP(3) }}</td>
          <td>{{ currentEmployeeWFP(3) }}</td>
          <td>{{ previousEmployeeWFP(4) }}</td>
          <td>{{ currentEmployeeWFP(4) }}</td>
        </tr>
        <tr>
          <th class="vertical-line">{{$t('keyfigures.num_emp_wofp')}}</th>
          <td>{{ previousEmployeeWOFP(0) }}</td>
          <td>{{ currentEmployeeWOFP(0) }}</td>
          <td>{{ previousEmployeeWOFP(1) }}</td>
          <td>{{ currentEmployeeWOFP(1) }}</td>
          <td>{{ previousEmployeeWOFP(2) }}</td>
          <td>{{ currentEmployeeWOFP(2) }}</td>
          <td>{{ previousEmployeeWOFP(3) }}</td>
          <td>{{ currentEmployeeWOFP(3) }}</td>
          <td>{{ previousEmployeeWOFP(4) }}</td>
          <td>{{ currentEmployeeWOFP(4) }}</td>
        </tr>
        <tr>
          <th class="vertical-line">{{$t('keyfigures.num_emp')}}</th>
          <td>{{ previousEmployeeProcess(0) }}</td>
          <td>{{ currentEmployeeProcess(0) }}</td>
          <td>{{ previousEmployeeProcess(1) }}</td>
          <td>{{ currentEmployeeProcess(1) }}</td>
          <td>{{ previousEmployeeProcess(2) }}</td>
          <td>{{ currentEmployeeProcess(2) }}</td>
          <td>{{ previousEmployeeProcess(3) }}</td>
          <td>{{ currentEmployeeProcess(3) }}</td>
          <td>{{ previousEmployeeProcess(4) }}</td>
          <td>{{ currentEmployeeProcess(4) }}</td>
        </tr>
        <tr>
          <th class="vertical-line">{{$t('keyfigures.workload_emp')}}</th>
          <td>{{ workloadEmployees[0] }} %</td>
          <td></td>
          <td>{{ workloadEmployees[1] }} %</td>
          <td></td>
          <td>{{ workloadEmployees[2] }} %</td>
          <td></td>
          <td>{{ workloadEmployees[3] }} %</td>
          <td></td>
          <td>{{ workloadEmployees[4] }} %</td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_conveyor_wfp')}}</th>
          <td>{{ previousConveyorWFP(0) }}</td>
          <td>{{ currentConveyorWFP(0) }}</td>
          <td>{{ previousConveyorWFP(1) }}</td>
          <td>{{ currentConveyorWFP(1) }}</td>
          <td>{{ previousConveyorWFP(2) }}</td>
          <td>{{ currentConveyorWFP(2) }}</td>
          <td>{{ previousConveyorWFP(3) }}</td>
          <td>{{ currentConveyorWFP(3) }}</td>
          <td>{{ previousConveyorWFP(4) }}</td>
          <td>{{ currentConveyorWFP(4) }}</td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_conveyor_wofp')}}</th>
          <td>{{ previousConveyorWOFP(0) }}</td>
          <td>{{ currentConveyorWOFP(0) }}</td>
          <td>{{ previousConveyorWOFP(1) }}</td>
          <td>{{ currentConveyorWOFP(1) }}</td>
          <td>{{ previousConveyorWOFP(2) }}</td>
          <td>{{ currentConveyorWOFP(2) }}</td>
          <td>{{ previousConveyorWOFP(3) }}</td>
          <td>{{ currentConveyorWOFP(3) }}</td>
          <td>{{ previousConveyorWOFP(4) }}</td>
          <td>{{ currentConveyorWOFP(4) }}</td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_conveyor')}}</th>
          <td>{{ previousConveyorProcess(0) }}</td>
          <td>{{ currentConveyorProcess(0) }}</td>
          <td>{{ previousConveyorProcess(1) }}</td>
          <td>{{ currentConveyorProcess(1) }}</td>
          <td>{{ previousConveyorProcess(2) }}</td>
          <td>{{ currentConveyorProcess(2) }}</td>
          <td>{{ previousConveyorProcess(3) }}</td>
          <td>{{ currentConveyorProcess(3) }}</td>
          <td>{{ previousConveyorProcess(4) }}</td>
          <td>{{ currentConveyorProcess(4) }}</td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.workload_conveyor')}}</th>
          <td>{{ workloadConveyor[0] }} %</td>
          <td></td>
          <td>{{ workloadConveyor[1] }} %</td>
          <td></td>
          <td>{{ workloadConveyor[2] }} %</td>
          <td></td>
          <td>{{ workloadConveyor[3] }} %</td>
          <td></td>
          <td>{{ workloadConveyor[4] }} %</td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_overtime')}}</th>
          <td>{{ previousOvertimeProcess[0] }}</td>
          <td>{{ overtimeProcess[0] }}</td>
          <td>{{ previousOvertimeProcess[1] }}</td>
          <td>{{ overtimeProcess[1] }}</td>
          <td>{{ previousOvertimeProcess[2] }}</td>
          <td>{{ overtimeProcess[2] }}</td>
          <td>{{ previousOvertimeProcess[3] }}</td>
          <td>{{ overtimeProcess[3] }}</td>
          <td>{{ previousOvertimeProcess[4] }}</td>
          <td>{{ overtimeProcess[4] }}</td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_transportable_pallets')}}</th>
          <td>{{ previousPalletsToBeTransported(0) }}</td>
          <td>{{ currentPalletsToBeTransportedIn() }}</td>
          <td>{{ previousPalletsToBeTransported(1) }}</td>
          <td>{{ currentPalletsToBeTransportedIn() }}</td>
          <td>{{ previousPalletsToBeTransported(2) }}</td>
          <td>{{ currentPalletsToBeTransportedStorage() }}</td>
          <td>{{ previousPalletsToBeTransported(3) }}</td>
          <td>{{ currentPalletsToBeTransportedOut() }}</td>
          <td>{{ previousPalletsToBeTransported(4) }}</td>
          <td>{{ currentPalletsToBeTransportedOut() }}</td>
        </tr>
        <tr>
          <th>{{$t('keyfigures.num_transported_pallets')}}</th>
          <td>{{ palletsTransportedProcess[0] }}</td>
          <td></td>
          <td>{{ palletsTransportedProcess[1] }}</td>
          <td></td>
          <td>{{ palletsTransportedProcess[2] }}</td>
          <td></td>
          <td>{{ palletsTransportedProcess[3] }}</td>
          <td></td>
          <td>{{ palletsTransportedProcess[4] }}</td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </container>
  </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import {mapGetters} from "vuex";

export default {
  components: {Container},
  methods: {
    previousConveyorProcess(process) {
      let count = 0;
      this.previousConveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber - 1 &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    previousEmployeeProcess(process) {
      let count = 0;
      this.previousEmployeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber - 1 &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    currentEmployeeProcess(process) {
      let count = 0;
      this.employeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    currentEmployeeWFP(process) {
      let count = 0;
      this.employeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber &&
            dynamic.process === process.toString() &&
            dynamic.qualification % 2 === 1
        )
          count++;
      });
      return count;
    },
    currentEmployeeWOFP(process) {
      let count = 0;
      this.employeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber &&
            dynamic.process === process.toString() &&
            dynamic.qualification % 2 !== 1
        )
          count++;
      });
      return count;
    },
    previousEmployeeWFP(process) {
      let count = 0;
      this.previousEmployeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber - 1 &&
            dynamic.process === process.toString() &&
            dynamic.qualification % 2 === 1
        )
          count++;
      });
      return count;
    },
    previousEmployeeWOFP(process) {
      let count = 0;
      this.previousEmployeeDynamics.forEach((dynamic) => {
        if (
            dynamic.employee.employmentRound <= this.roundNumber - 1 &&
            dynamic.process === process.toString() &&
            dynamic.qualification % 2 !== 1
        )
          count++;
      });
      return count;
    },
    currentConveyorWFP(process) {
      let count = 0;
      this.conveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber &&
            dynamic.conveyor.needsForkliftPermit &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    previousConveyorWFP(process) {
      let count = 0;
      this.previousConveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber - 1 &&
            dynamic.conveyor.needsForkliftPermit &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    currentConveyorWOFP(process) {
      let count = 0;
      this.conveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber &&
            dynamic.conveyor.needsForkliftPermit &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    previousConveyorWOFP(process) {
      let count = 0;
      this.previousConveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber - 1 &&
            !dynamic.conveyor.needsForkliftPermit &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    currentConveyorProcess(process) {
      let count = 0;
      this.conveyorDynamics.forEach((dynamic) => {
        if (
            dynamic.roundBought <= this.roundNumber - 1 &&
            dynamic.process === process.toString()
        )
          count++;
      });
      return count;
    },
    currentPalletsToBeTransportedIn() {
      let count = 0;
      this.orders.forEach((order) => {
        if (order.deliveryRound === this.roundNumber)
          count += order.quantity;
      });
      return count;
    },
    currentPalletsToBeTransportedStorage() {
      let count = 0;
      this.orders.forEach((order) => {
        if (order.deliveryRound === this.roundNumber)
          count += order.quantity;
      });
      this.customerJobs.forEach((job) => {
        count += job.quantity;
      });
      return count;
    },
    currentPalletsToBeTransportedOut() {
      let count = 0;
      this.customerJobs.forEach((job) => {
        count += job.quantity;
      });
      return count;
    },
    previousPalletsToBeTransported(process) {
      return (
          this.palletsTransportedProcess[process] +
          this.palletsNotTransportedProcess[process]
      );
    },
  },
  computed: {
    ...mapGetters({
      employeeDynamics: "employeeDynamics",
      previousEmployeeDynamics: "previousEmployeeDynamics",
      workloadEmployees: "workloadEmployees",
      conveyorDynamics: "conveyorDynamics",
      previousConveyorDynamics: "previousConveyorDynamics",
      workloadConveyor: "workloadConveyor",
      overtimeProcess: "overtimeProcess",
      previousOvertimeProcess: "previousOvertimeProcess",
      palletsTransportedProcess: "palletsTransportedProcess",
      palletsNotTransportedProcess: "palletsNotTransportedProcess",
      orders: "orders",
      roundNumber: "roundNumber",
      customerJobs: "customerJobs",
    }),
  },
};
</script>

<style scoped>
.horizontal-line {
  border-top: 1px solid #eeeeee;
}

table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  min-font-size: 1vw;
  min-width: 50px;
  background-color: inherit;
  width: 100%;
  text-align: left;
}

table thead tr {
  background-color: #007598;
  color: #ffffff;
  position: sticky;
  top: 0;
}

table th, table td {
  padding: 1vh 5px;
}

table tbody tr {
  border-bottom: 1px solid #dddddd;
}

table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

table tbody tr:last-of-type {
  border-bottom: 2px solid #007598;
}

table tbody tr:hover {
  background-color: rgba(0, 117, 152, 0.50);
}
</style>