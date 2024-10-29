<template>
    <div>
        <div>
            <custom-modal
                v-show="modalVisible"
                name="hireModal"
                @close="modalVisible = false"
            >
                <template v-slot:header
                >{{$t('human_resource.dia_hire', {empName : currentSelectedName})}}
                </template
                >
                <template v-slot:body>
          <span>
            {{$t('human_resource.dia_hire_info', {empName : currentSelectedName, contractType: currentSelectedContractType})}}
          </span>
                    <br/>
                    <br/>
                    <span>
            {{$t('human_resource.dia_hire_salary', {money : toCurrency(currentSelectedSalary)})}}
          </span>
                    <br/>
                    <br/>
                    <span>
            {{$t('human_resource.dia_hire_cost', {money : toCurrency(currentSelectedHireCost)})}}
          </span>
                    <br/>
                    <br/>
                    <span>
            {{$t('human_resource.dia_hire_start', {roundNum : currentSelectedEmploymentRound})}}
          </span>
                    <br/>
                    <br/>
                </template>
                <template v-slot:footer>
                    <custom-button style="width:150px" @click="employ()">
                        {{$t('common.accept')}}
                    </custom-button>
                    <custom-button style="width:150px" @click="modalVisible = false">
                      {{$t('common.cancel')}}
                    </custom-button>
                </template>
            </custom-modal>
        </div>
        <div class="box">
            <header>
                <h1>{{$t('human_resource.job_market')}}</h1>
            </header>
            <container :title="$t('human_resource.job_market')">
                <custom-table :columns="storeEmployeeTable" :items="employeeStore">
                    <template #processInput="slotProps">
                        <custom-select v-model="chosenProcesses[slotProps.index]">
                            <option
                                v-for="(option, idx) in processes"
                                :key="option"
                                :value="idx"
                            >{{ option }}
                            </option
                            >
                        </custom-select>
                    </template>
                    <template #hireFulltimeButton="slotProps">
                        <custom-button
                            @click="openModal(slotProps.item.employee.id, 0, slotProps.index)"
                        >{{$t('human_resource.full_time')}}
                        </custom-button
                        >
                    </template>
                    <template #hireHalftimeButton="slotProps">
                        <custom-button
                            @click="openModal(slotProps.item.employee.id, 1, slotProps.index)"
                        >{{$t('human_resource.part_time')}}
                        </custom-button
                        >
                    </template>
                    <template #hireTempButton="slotProps">
                        <custom-button
                            @click="openModal(slotProps.item.employee.id, 2, slotProps.index)"
                        >
                          {{$t('human_resource.temp_time')}}
                        </custom-button>
                    </template>
                </custom-table>
            </container>
            <container :title="$t('human_resource.future_emp')">
                <custom-table :columns="futureEmployeeTable" :items="futureEmployee"/>
            </container>
        </div>
    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {mapGetters} from "vuex";
import CustomSelect from "../custom/Custom-Select.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import {toCurrency} from "@/functions/currency";

export default {
    components: {
        Container,
        CustomButton,
        CustomSelect,
        CustomTable,
        CustomModal,
    },
    data() {
        return {
            currentSelection: undefined,
            currentContractType: undefined,
            currentProcessIndex: undefined,
            modalVisible: false,
            processes: [this.$t('common.unloading'), this.$t('common.receipt_of_goods'), this.$t('common.storage'), this.$t('common.outgoing_goods_control'), this.$t('common.loading'),],
        };
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
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
            let fkQuali = qualification % 2 === 1;
            let qmQuali = qualification > 3;
            let secQuali =
                qualification === 2 ||
                qualification === 3 ||
                qualification === 6 ||
                qualification === 7;
            return [fkQuali, secQuali, qmQuali];
        },
        employ() {
            if (this.currentSelection === undefined) return;
            this.modalVisible = false;
            let process = this.chosenProcesses[this.currentProcessIndex];
            this.$store.dispatch("hireEmployee", {
                stateId: this.stateId,
                employeeId: this.currentSelection,
                process: process,
                contractType: this.currentContractType,
            });
            this.currentSelection = undefined;
            this.chosenProcesses.splice(this.currentProcessIndex, 1);
        },
        openModal(employeeId, contractType, index) {
            this.currentSelection = employeeId;
            this.currentContractType = contractType;
            this.currentProcessIndex = index;
            this.modalVisible = true;
        },
    },
    computed: {
        ...mapGetters({
            stateId: "currentStateId",
            employeeStore: "employeeStore",
            employeeDynamics: "employeeDynamics",
            roundNumber: "roundNumber",
            halfTimeCompensation: "halfTimeCompensation",
            fullTimeHireCost: "fullTimeHireCost",
            halfTimeHireCost: "halfTimeHireCost",
        }),
        currentSelectedContractType() {
            if (this.currentSelection === undefined) return;
            switch (this.currentContractType) {
                case 0:
                    return this.$t('human_resource.full_time');
                case 1:
                    return this.$t('human_resource.part_time');
                case 2:
                    return this.$t('human_resource.temp_time');
                default:
                    return "";
            }
        },
        currentSelectedEmployee() {
            let employeeId = this.currentSelection;
            return this.employeeStore.find(
                (dynamic) => dynamic.employee.id === employeeId
            );
        },
        currentSelectedName() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedEmployee.employee.name;
        },
        currentSelectedSalary() {
            if (this.currentSelection === undefined) return;
            switch (this.currentContractType) {
                case 1:
                    return (
                        this.currentSelectedEmployee.salary * this.halfTimeCompensation
                    );
                default:
                    return this.currentSelectedEmployee.salary;
            }
        },
        currentSelectedHireCost() {
            if (this.currentSelection === undefined) return;
            switch (this.currentContractType) {
                case 2:
                    return this.halfTimeHireCost;
                default:
                    return this.fullTimeHireCost;
            }
        },
        currentSelectedEmploymentRound() {
            if (this.currentSelection === undefined) return;
            switch (this.currentContractType) {
                case 2:
                    return this.roundNumber + 1;
                default:
                    return this.roundNumber + 3;
            }
        },
        futureEmployee() {
            return this.employeeDynamics.filter(
                (dynamic) => dynamic.employee.employmentRound > this.roundNumber
            );
        },
        chosenProcesses() {
            return Array(this.$store.getters.employeeStore.length).fill(0);
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
        storeEmployeeTable() {
            return [
                {
                    headerLabel: this.$t('human_resource.name'),
                    cell: (dynamic) => dynamic.employee.name,
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
                    headerLabel: this.$t('human_resource.salary'),
                    cell: (dynamic) => this.toCurrency(dynamic.salary),
                },
                {
                    headerLabel: this.$t('human_resource.process'),
                    cell: "processInput",
                },
                {
                    headerLabel: this.$t('human_resource.hire'),
                    cell: "hireFulltimeButton",
                },
                {
                    headerLabel: this.$t('human_resource.hire'),
                    cell: "hireHalftimeButton",
                },
                {
                    headerLabel: this.$t('human_resource.hire'),
                    cell: "hireTempButton",
                },
            ];
        },
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-rows: 5rem calc(70vh - 3rem) calc(30vh - 3rem);
}

header {
    grid-column: span 1;
}
</style>
