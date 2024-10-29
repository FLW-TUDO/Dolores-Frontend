<template>
    <div>
        <custom-modal
            v-show="fireModalVisible"
            name="fireModal"
            @close="fireModalVisible = false"
        >
            <template v-slot:header>{{$t('human_resource.fire')}}</template>
            <template v-slot:body>
          <span>
            {{ $t('human_resource.dia_fire', { empName: currentSelectedName }) }}
          </span>
                <br/>
                <br/>
                <span>
            {{ $t('human_resource.dia_fire_info', { empName: currentSelectedName, roundNum: currentSelectedEndRound }) }}
          </span>
                <br/>
                <br/>
                <span>
            {{ $t('human_resource.dia_fire_cost', { money: toCurrency(currentSelectedCompensation) }) }}
          </span>
                <br/>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="terminate()">
                    {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="fireModalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
        <custom-modal
            v-show="trainModalVisible"
            name="trainEmployee"
            @close="trainModalVisible = false"
        >
            <template v-slot:header>{{$t('human_resource.dia_training')}}</template>
            <template v-slot:body>
          <span>
            {{$t('human_resource.dia_training_info', {empName: currentSelectedName, qualName:currentSelectedQualificationName, money: toCurrency(currentSelectedQualificationCost)})}}
          </span>
                <br/>
                <br/>
                <span>
            {{$t('human_resource.dia_training_duration', {duration : currentSelectedQualificationDuration})}} {{$t('side_menu.round_num', currentSelectedQualificationDuration)}}.
          </span>
                <br/>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="trainEmployee()">
                    {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="trainModalVisible = false">
                    {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
    </div>
    <div class="main">
        <div class="box">
            <header>
                <h1>{{$t('human_resource.human_resource')}}</h1>
            </header>

            <container :title="$t('human_resource.list_of_emp')">
                <custom-table :columns="allEmployeeTable" :items="currentEmployee">
                    <template #fkQualification="slotProps">
                        <span v-if="getQualification(slotProps.item.qualification)[0] === true">{{ $t('common.yes') }}</span>
                        <span v-else-if="getTrainingInProcess(slotProps.item, 0)">{{ $t('human_resource.in_process') }}</span>
                        <custom-button v-else @click="openTrainModal(slotProps.item.employee.id, 0)">{{ $t('human_resource.train') }}
                        </custom-button>
                    </template>
                    <template #safetyQualification="slotProps">
                        <span v-if="getQualification(slotProps.item.qualification)[1] === true">{{ $t('common.yes') }}</span>
                        <span v-else-if="getTrainingInProcess(slotProps.item, 1)">{{ $t('human_resource.in_process') }}</span>
                        <custom-button v-else @click="openTrainModal(slotProps.item.employee.id, 1)">{{ $t('human_resource.train') }}
                        </custom-button>
                    </template>
                    <template #qmQualification="slotProps">
                        <span v-if="getQualification(slotProps.item.qualification)[2] === true">{{ $t('common.yes') }}</span>
                        <span v-else-if="getTrainingInProcess(slotProps.item, 2)">{{ $t('human_resource.in_process') }}</span>
                        <custom-button v-else @click="openTrainModal(slotProps.item.employee.id, 2)">{{ $t('human_resource.train') }}
                        </custom-button>
                    </template>
                    <template #processInput="slotProps">
                        <custom-select
                            v-model="chosenProcess[slotProps.index]"
                            @change="changeProcess(slotProps.item, slotProps.index)"
                        >
                            <option
                                v-for="(process, idx) in processes"
                                :key="process"
                                :value="idx"
                            >
                                {{ process }}
                            </option>
                        </custom-select>
                    </template>
                    <template #fireButton="slotProps">
                        <custom-button
                            :disabled="canNotBeTerminated(slotProps.item.employee)"
                            @click="openFireModal(slotProps.item.employee.id)"
                        >
                          {{ $t('human_resource.fire') }}
                        </custom-button>
                    </template>
                </custom-table>
            </container>
            <container class="row-span" :title="$t('human_resource.work_time')">
                <custom-table :columns="worktimeEmployeeTable" :items="processes">
                    <template #inputOvertime="slotProps">
                        <custom-select
                            v-model="chosenOvertime[slotProps.index]"
                            @change="updateOvertime(slotProps.index)"
                        >
                            <option v-for="option in overtime" :key="option">{{ option }}</option>
                        </custom-select>
                    </template>
                </custom-table>
                <h3>{{ $t('human_resource.emp_qualification') }}</h3>
                <custom-table :columns="qualificationEmployeeTable" :items="processes"/>
                <h3>{{ $t('human_resource.work_climate') }}</h3>
                <custom-select v-model="investment">
                    <option
                        v-for="option in investment_options"
                        :key="option"
                        :value="option"
                    >{{ toCurrency(option) }}
                    </option
                    >
                </custom-select>
                <span>{{ $t('human_resource.work_climate_invest') }}</span>
            </container>
            <container :title="$t('human_resource.future_emp')">
                <custom-table :columns="futureEmployeeTable" :items="futureEmployee"/>
            </container>
        </div>
    </div>
</template>

<script>
import CustomModal from "../custom/Custom-Modal.vue";
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomTable from "../custom/Custom-Table.vue";
import CustomSelect from "../custom/Custom-Select.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
    components: {Container, CustomButton, CustomTable, CustomModal, CustomSelect},
    data() {
        return {
            trainModalVisible: false,
            fireModalVisible: false,
            currentSelection: undefined,
            currentSelectedQualification: undefined,
            processes: [this.$t('common.unloading'), this.$t('common.receipt_of_goods'), this.$t('common.storage'), this.$t('common.outgoing_goods_control'), this.$t('common.loading'),],
        };
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
        },
        openFireModal(employeeId) {
            this.currentSelection = employeeId;
            this.fireModalVisible = true;
        },
        openTrainModal(employeeId, qualification) {
            this.currentSelection = employeeId;
            this.currentSelectedQualification = qualification;
            this.trainModalVisible = true;
        },
        availableThisRound(dynamic) {
            return dynamic.employee.employmentRound <= this.roundNumber;
        },
        isFKQualification(qualification) {
            return qualification % 2 === 1;
        },
        isSecQualification(qualification) {
            return [2, 3, 6, 7].includes(qualification);
        },
        isQMQualification(qualification) {
            return qualification > 3;
        },
        getQualification(qualification) {
            /* Qualification
             *   1 = FP
             *   2 = Security
             *   3 = FP + Security
             *   4 = QM
             *   5 = FP + QM
             *   6 = Security + QM
             *   7 = FP + QM + Security
             */
            let fkQuali = this.isFKQualification(qualification)
            let secQuali = this.isSecQualification(qualification)
            let qmQuali = this.isQMQualification(qualification)
            return [fkQuali, secQuali, qmQuali];
        },
        getTrainingInProcess(dynamic, qualification) {
            switch (qualification) {
                case 0:
                    return dynamic.fpRound > this.roundNumber;
                case 1:
                    return dynamic.secRound > this.roundNumber;
                case 2:
                    return dynamic.qmRound > this.roundNumber;
            }
        },
        getEmployeeCountProcess(process) {
            let count = 0;
            let processId = this.processes.indexOf(process);
            this.employeeDynamics.forEach((dynamic) => {
                if (processId === parseInt(dynamic.process) && this.availableThisRound(dynamic)) count += 1;
            });
            return count;
        },
        getEmployeeFKCountProcess(process) {
            let count = 0;
            let processId = this.processes.indexOf(process);
            this.employeeDynamics.forEach((dynamic) => {
                if (processId === parseInt(dynamic.process) && this.availableThisRound(dynamic) && this.isFKQualification(dynamic["qualification"])) count += 1;
            });
            return count;
        },
        getEmployeeSecCountProcess(process) {
            let count = 0;
            let processId = this.processes.indexOf(process);
            this.employeeDynamics.forEach((dynamic) => {
                if (processId === parseInt(dynamic.process) && this.availableThisRound(dynamic) && this.isSecQualification(dynamic["qualification"])) count += 1;
            });
            return count;
        },
        getEmployeeQMCountProcess(process) {
            let count = 0;
            let processId = this.processes.indexOf(process);
            this.employeeDynamics.forEach((dynamic) => {
                if (processId === parseInt(dynamic.process) && this.availableThisRound(dynamic) && this.isQMQualification(dynamic["qualification"])) count += 1;
            });
            return count;
        },
        getContract(employee) {
            if (employee.endRound < 1000) return employee.endRound;
            switch (employee.contractType) {
                case 1:
                    return this.$t('human_resource.part_time');
                case 2:
                    return employee.endRound;
                default:
                    return this.$t('human_resource.full_time');
            }
        },
        canNotBeTerminated(employee) {
            return employee.endRound < 1000;
        },
        terminate() {
            if (!this.currentSelection) return;
            this.fireModalVisible = false;
            this.$store.dispatch("terminateEmployee", {
                stateId: this.stateId,
                employeeId: this.currentSelection,
            });
        },
        trainEmployee() {
            if (this.currentSelection === undefined) return;
            let newQuali = this.qualificationOffset[this.currentSelectedQualification];
            this.$store.dispatch("trainEmployee", {
                stateId: this.stateId,
                employeeId: this.currentSelection,
                qualification: newQuali,
            });
            this.trainModalVisible = false;
        },
        changeProcess(dynamic, index) {
            let employeeId = dynamic.employee.id;
            let newProcess = this.chosenProcess[index];
            this.$store.dispatch("updateEmployeeProcess", {
                stateId: this.stateId,
                employeeId: employeeId,
                process: newProcess,
            });
        },
        updateOvertime(process) {
            this.$store.dispatch("setOvertime", {
                stateId: this.stateId,
                process: process,
                overtime: this.chosenOvertime[process],
            });
        },
    },
    computed: {
        ...mapGetters({
            compensationQuota: "compensationQuota",
            employeeDynamics: "employeeDynamics",
            roundNumber: "roundNumber",
            workloadEmployees: "workloadEmployees",
            stateId: "currentStateId",
            overtimeProcess: "overtimeProcess",
            investment_options: "investment_options",
            overtime: "overtimeChoices",
            qualificationOffset: "qualificationOffset",
            qualificationCost: "qualificationCost",
            qualificationDuration: "qualificationDuration",
            workload_employee_storage_in: "workload_employee_storage_in",
            workload_employee_storage_out: "workload_employee_storage_out",
            crash_time: "crash_time",
        }),
        futureEmployee() {
            return this.employeeDynamics.filter(
                (dynamic) => dynamic.employee.employmentRound > this.roundNumber
            );
        },
        currentEmployee() {
            return this.employeeDynamics.filter(
                (dynamic) => dynamic.employee.employmentRound <= this.roundNumber
            );
        },
        currentSelectedEmployee() {
            let employeeId = this.currentSelection;
            return this.employeeDynamics.find(
                (dynamic) => dynamic.employee.id === employeeId
            );
        },
        currentSelectedName() {
            if (this.currentSelection === undefined) return '';
            return this.currentSelectedEmployee.employee.name;
        },
        currentSelectedContractType() {
            return this.currentSelectedEmployee.employee.contractType;
        },
        currentSelectedEndRound() {
            if (this.currentSelection === undefined) return;
            switch (this.currentSelectedContractType) {
                case 2:
                    return this.roundNumber + 1;
                default:
                    return this.roundNumber + 3;
            }
        },
        currentSelectedCompensation() {
            if (this.currentSelection === undefined) return;
            let employmentDuration =
                this.currentSelectedEndRound -
                this.currentSelectedEmployee.employee.employmentRound;
            return Math.floor(
                employmentDuration *
                this.currentSelectedEmployee.salary *
                this.compensationQuota
            );
        },
        currentSelectedQualificationName() {
            if (this.currentSelection === undefined) return;
            switch (this.currentSelectedQualification) {
                case 0:
                    return this.$t('human_resource.forklift_permit');
                case 1:
                    return this.$t('human_resource.security_training');
                case 2:
                    return this.$t('human_resource.quality_management_sem');
                default:
                    return "";
            }
        },
        currentSelectedQualificationCost() {
            if (this.currentSelection === undefined) return;
            return this.qualificationCost[this.currentSelectedQualification];
        },
        currentSelectedQualificationDuration() {
            if (this.currentSelection === undefined) return;
            return this.qualificationDuration[this.currentSelectedQualification]
        },
        chosenOvertime() {
            return Array.from(
                {
                    length: this.$store.getters.currentRoundValues.overtime_process
                        .length,
                },
                (v, i) => this.$store.getters.currentRoundValues.overtime_process[i]
            );
        },
        chosenProcess() {
            return Array.from(
                {length: this.currentEmployee.length},
                (v, i) => this.currentEmployee[i].process
            );
        },
        investment: {
            get() {
                return this.$store.getters.workClimateInvestment;
            },
            set(newValue) {
                this.$store.dispatch("setClimateInvest", {
                    stateId: this.stateId,
                    climateInvestment: newValue,
                });
            },
        },
        futureEmployeeTable() {
            return [
                {
                    headerLabel: this.$t('human_resource.name'),
                    cell: (dynamic) => dynamic.employee.name,
                },
                {
                    headerLabel: this.$t('human_resource.contract_type'),
                    cell: (dynamic) => {
                        switch (dynamic["employee"]["contractType"]) {
                            case 0:
                                return this.$t('human_resource.full_time');
                            case 1:
                                return this.$t('human_resource.part_time');
                            case 2:
                                return this.$t('human_resource.temp_time');
                            default:
                                return this.$t('human_resource.unknown');
                        }
                    },
                },
                {
                    headerLabel: this.$t('human_resource.contract_as_of'),
                    cell: (dynamic) => dynamic.employee.employmentRound,
                },
                {
                    headerLabel: this.$t('human_resource.forklift_permit'),
                    cell: (dynamic) =>
                        this.getQualification(dynamic.qualification)[0] ? this.$t('common.yes') : this.$t('common.no'),
                },
                {
                    headerLabel: this.$t('human_resource.security_training'),
                    cell: (dynamic) =>
                        this.getQualification(dynamic.qualification)[1] ? this.$t('common.yes') : this.$t('common.no'),
                },
                {
                    headerLabel: this.$t('human_resource.quality_management_sem'),
                    cell: (dynamic) =>
                        this.getQualification(dynamic.qualification)[2] ? this.$t('common.yes') : this.$t('common.no'),
                },
                {
                    headerLabel: this.$t('human_resource.process'),
                    cell: (dynamic) => this.processes[dynamic.process],
                },
                {
                    headerLabel: this.$t('human_resource.salary'),
                    cell: (dynamic) => toCurrency(dynamic.salary),
                },
            ];
        },
        allEmployeeTable() {
            return [
                {
                    headerLabel: this.$t('human_resource.name'),
                    cell: (dynamic) => dynamic.employee.name,
                },
                {
                    headerLabel: this.$t('human_resource.contract_type'),
                    cell: (dynamic) => {
                        switch (dynamic["employee"]["contractType"]) {
                            case 0:
                                return this.$t('human_resource.full_time');
                            case 1:
                                return this.$t('human_resource.part_time');
                            case 2:
                                return this.$t('human_resource.temp_time');
                            default:
                                return this.$t('human_resource.unknown');
                        }
                    },
                },
                {
                    headerLabel: this.$t('human_resource.contract_till'),
                    cell: (dynamic) => this.getContract(dynamic.employee),
                },
                {
                    headerLabel: this.$t('human_resource.forklift_permit'),
                    cell: "fkQualification",
                },
                {
                    headerLabel: this.$t('human_resource.security_training'),
                    cell: "safetyQualification",
                },
                {
                    headerLabel: this.$t('human_resource.quality_management_sem'),
                    cell: "qmQualification",
                },
                {
                    headerLabel: this.$t('human_resource.process'),
                    cell: "processInput",
                },
                {
                    headerLabel: this.$t('human_resource.motivation'),
                    cell: (dynamic) => dynamic.motivation + " %",
                },
                {
                    headerLabel: this.$t('human_resource.salary'),
                    cell: (dynamic) => this.toCurrency(dynamic.salary),
                },
                {
                    headerLabel: this.$t('human_resource.fire'),
                    cell: "fireButton",
                },
            ];
        },
        worktimeEmployeeTable() {
            return [
                {
                    headerLabel: this.$t('human_resource.process'),
                    cell: (process) => process,
                },
                {
                    headerLabel: this.$t('human_resource.capacity'),
                    cell: (_, index) => {
                        if (index === 2)
                            return `${this.workload_employee_storage_in} % | ${this.workload_employee_storage_out} %`;
                        else
                            return this.workloadEmployees[index] + " %";
                    },
                },
                {
                    headerLabel: this.$t('human_resource.crash_delay'),
                    cell: (_, index) => Math.round(this.crash_time[index] / 60) + " min",
                },
                {
                    headerLabel: this.$t('human_resource.overtime'),
                    cell: "inputOvertime",
                },
            ];
        },
        qualificationEmployeeTable() {
            return [
                {
                    headerLabel: this.$t('human_resource.process'),
                    cell: (process) => process,
                },
                {
                    headerLabel: this.$t('human_resource.num_emp'),
                    cell: (process) => this.getEmployeeCountProcess(process),
                },
                {
                    headerLabel: this.$t('human_resource.num_wfp'),
                    cell: (process) => this.getEmployeeFKCountProcess(process),
                },
                {
                    headerLabel: this.$t('human_resource.num_sec'),
                    cell: (process) => this.getEmployeeSecCountProcess(process),
                },
                {
                    headerLabel: this.$t('human_resource.num_qm'),
                    cell: (process) => this.getEmployeeQMCountProcess(process),
                },
            ];
        },
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 5rem calc(70vh - 3rem) calc(30vh - 3rem);
}

.row-span {
    grid-row: span 2;
}

header {
    grid-column: span 2;
}
</style>