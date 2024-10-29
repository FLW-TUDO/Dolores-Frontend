<template>
    <div>
        <custom-modal
            v-show="maintenanceModalVisible"
            name="maintainConveyor"
            @close="maintenanceModalVisible = false"
        >
            <template v-slot:header>{{$t('conveyor.dia_maintenance')}}</template>
            <template v-slot:body>
                  <span>
                    {{$t('conveyor.dia_maintenance_info', {conveyorName:currentSelectedName, actionName:currentSelectedMaintenanceActionName})}}
                  </span>
                <br/>
                <br/>
                <span>
                  {{$t('conveyor.dia_maintenance_cost', {maintenanceName:currentSelectedMaintenanceEffectName, money:toCurrency(currentSelectedMaintenanceCost)})}}
          </span>
                <br/>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="changeConveyorMaintenance()">
                    {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="maintenanceModalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
        <custom-modal
            v-show="overhaulModalVisible"
            name="overhaulConveyor"
            @close="overhaulModalVisible = false"
        >
            <template v-slot:header>{{$t('conveyor.dia_overhaul')}}</template>
            <template v-slot:body>
                <span>{{$t('conveyor.dia_overhaul_info', {conveyorName: currentSelectedName})}}</span>
                <br/>
                <br/>
                <span>
                  {{$t('conveyor.dia_overhaul_cost', {money:toCurrency(currentSelectedOverhaulCost)})}}
          </span>
                <br/>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="overhaulConveyor()">
                  {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="overhaulModalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
    </div>
    <div class="main">
        <div class="box">
            <header>
                <h1>{{$t('conveyor.conveyor')}}</h1>
            </header>
            <container class="list" :title="$t('conveyor.current_conveyor')">
                <custom-table :columns="conveyorDataColumns" :items="availableConveyor">
                    <template #processInput="slotProps">
                        <template v-if="!slotProps.item.sold">
                            <custom-select
                                v-model="chosenProcess[slotProps.index]"
                                @change="changeProcess(slotProps.item, slotProps.index)"
                            >
                                <option
                                    v-for="(process, idx) in availableProcesses"
                                    :key="process"
                                    :value="idx"
                                >
                                    {{ process }}
                                </option>
                            </custom-select>
                        </template>
                        <template v-else>
                            <span>{{$t('conveyor.sold')}}</span>
                        </template>

                    </template>
                    <template #maintenanceButton="slotProps">
                        <custom-button style="width: 100%" @click="openMaintenanceModal(slotProps.item.conveyor.id)">
            <span v-if="slotProps.item.maintenanceEnabled">
              {{$t('conveyor.fire')}}
            </span>
                            <span v-else>
              {{$t('conveyor.conclude')}}
            </span>
                        </custom-button>
                    </template>
                    <template #overhaulButton="slotProps">
                        <custom-button
                            v-if="!slotProps.item.overhaul"
                            @click="openOverhaulModal(slotProps.item.conveyor.id)"
                        >
                          {{$t('conveyor.overhaul')}}
                        </custom-button>
                    </template>
                </custom-table>
            </container>

            <container class="column" :title="$t('conveyor.future_conveyor')">
                <custom-table
                    :columns="futureConveyorTable"
                    :items="getFutureConveyor"
                />
            </container>

            <container :title="$t('conveyor.running_cost')">
                <custom-table :columns="costConveyorTable" :items="[0]"/>
            </container>

            <container :title="$t('conveyor.capacity')">
                <custom-table
                    :columns="workloadConveyorTable"
                    :items="availableProcesses"
                />
            </container>

        </div>
    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomSelect from "../custom/Custom-Select.vue";
import CustomTable from "../custom/Custom-Table.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
    components: {Container, CustomButton, CustomSelect, CustomTable, CustomModal},
    data() {
        return {
            maintenanceModalVisible: false,
            overhaulModalVisible: false,
            currentSelection: undefined,
            processes: [this.$t('common.unloading'), this.$t('common.receipt_of_goods'), this.$t('common.storage'), this.$t('common.outgoing_goods_control'), this.$t('common.loading'),]
        }
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
        },
        openMaintenanceModal(conveyorId) {
            this.currentSelection = conveyorId;
            this.maintenanceModalVisible = true;
        },
        openOverhaulModal(conveyorId) {
            this.currentSelection = conveyorId;
            this.overhaulModalVisible = true;
        },
        changeProcess(dynamic, index) {
            let conveyorId = dynamic.conveyor.id;
            let newProcess = this.chosenProcess[index] * 2;
            this.$store.dispatch("updateConveyorProcess", {
                stateId: this.stateId,
                conveyorId: conveyorId,
                process: newProcess,
            });
        },
        isAvailable(dynamic) {
            return dynamic.roundBought + dynamic.conveyor.timeToDelivery <= this.roundNumber;
        },
        getConveyorCountProcess(process) {
            let count = 0;
            let processId = this.processes.indexOf(process);
            this.conveyorDynamics.forEach((dynamic) => {
                if (processId === parseInt(dynamic.process) && this.isAvailable(dynamic) && !dynamic.sold) count += 1;
            });
            return count;
        },
        changeConveyorMaintenance() {
            if (this.currentSelection === undefined) return;
            this.maintenanceModalVisible = false;
            this.$store.dispatch("updateConveyorMaintenance", {
                stateId: this.stateId,
                conveyorId: this.currentSelection,
            });
            this.currentSelection = undefined;
        },
        overhaulConveyor() {
            if (this.currentSelection === undefined) return;
            this.overhaulModalVisible = false;
            this.$store.dispatch("overhaulConveyor", {
                stateId: this.stateId,
                conveyorId: this.currentSelection,
            });
            this.currentSelection = undefined;
        },
        translateConveyor(conveyorName) {
          switch (conveyorName) {
            case "3Rad Elektro-Gablestapler": return this.$t('conveyor.conveyor_name_3de')
            case "4Rad Diesel-Gabelstapler (mit Filter)": return this.$t('conveyor.conveyor_name_4ddf')
            case "4Rad Diesel-Gabelstapler (ohne Filter)" : return this.$t('conveyor.conveyor_name_4dd')
            case "4Rad Elektro-Gabelstapler" : return this.$t('conveyor.conveyor_name_4de')
            case "4Rad Gas-Gabelstapler" : return this.$t('conveyor.conveyor_name_4dg')
            case "Elektrohandhubwagen" : return this.$t('conveyor.conveyor_name_eh')
            case "Geh-Hochhubwagen" : return this.$t('conveyor.conveyor_name_gh')
            case "Handgabelhubwagen" : return this.$t('conveyor.conveyor_name_hh')
            // Legacy system integration TODO remove me
            case "3-Rad Elektro-Gablestapler": return this.$t('conveyor.conveyor_name_3de')
            case "4-Rad Diesel-Gabelstapler (mit Filter)": return this.$t('conveyor.conveyor_name_4ddf')
            case "4-Rad Diesel-Gabelstapler (ohne Filter)" : return this.$t('conveyor.conveyor_name_4dd')
            case "4-Rad Elektro-Gabelstapler" : return this.$t('conveyor.conveyor_name_4de')
            case "4-Rad Gas-Gabelstapler": return this.$t('conveyor.conveyor_name_4dg')
            default : return conveyorName
          }
        }
    },
    computed: {
        ...mapGetters({
            conveyorDynamics: "conveyorDynamics",
            roundNumber: "roundNumber",
            workloadConveyor: "workloadConveyor",
            repairCost: "repairCost",
            repairDuration: "repairDuration",
            maintenanceCost: "maintenanceCost",
            stateId: "currentStateId",
            workload_conveyor_storage_in: "workload_conveyor_storage_in",
            workload_conveyor_storage_out: "workload_conveyor_storage_out",
            crash_time: "crash_time"
        }),
        currentSelectedConveyor() {
            if (this.currentSelection === undefined) return;
            let conveyorId = this.currentSelection;
            return this.conveyorDynamics.find(
                (dynamic) => dynamic.conveyor.id === conveyorId
            );
        },
        availableConveyor() {
            return this.conveyorDynamics.filter(dynamic => this.isAvailable(dynamic));
        },
        currentSelectedName() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.conveyor.name;
        },
        currentSelectedOverhaulCost() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.overhaul_cost;
        },
        currentSelectedMaintenanceCost() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.conveyor.maintenanceCost;
        },
        currentSelectedMaintenance() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.maintenanceEnabled;
        },
        currentSelectedMaintenanceActionName() {
            if (this.currentSelection === undefined) return;
            switch (this.currentSelectedMaintenance) {
                case true:
                    return this.$t('conveyor.fire', 2);
                case false:
                    return this.$t('conveyor.conclude', 2);
                default:
                    return "";
            }
        },
        currentSelectedMaintenanceEffectName() {
            if (this.currentSelection === undefined) return;
            switch (this.currentSelectedMaintenance) {
                case true:
                    return this.$t('conveyor.saving');
                case false:
                    return this.$t('conveyor.price');
                default:
                    return "";
            }
        },
        getFutureConveyor() {
            return this.conveyorDynamics.filter((dynamic) => !this.isAvailable(dynamic));
        },
        availableProcesses() {
            return this.processes.filter((process, index) => index % 2 === 0);
        },
        chosenProcess() {
            return Array.from(
                {length: this.availableConveyor.length},
                (v, i) => this.availableConveyor[i].process / 2
            );
        },
        conveyorDataColumns() {
            return [
                {
                    headerLabel: this.$t('conveyor.name'),
                    cell: (dynamic) => this.translateConveyor(dynamic.conveyor.name),
                },
                {
                    headerLabel: this.$t('conveyor.condition'),
                    cell: (dynamic) => dynamic.condition + " %",
                },
                {
                    headerLabel: this.$t('conveyor.bought_in_round'),
                    cell: (dynamic) => dynamic.roundBought,
                },
                {
                    headerLabel: this.$t('conveyor.process'),
                    cell: "processInput",
                },
                {
                    headerLabel: this.$t('conveyor.maintenance'),
                    cell: "maintenanceButton",
                },
                {
                    headerLabel: this.$t('conveyor.overhaul'),
                    cell: "overhaulButton",
                },
            ];
        },
        workloadConveyorTable() {
            return [
                {
                    headerLabel: this.$t('conveyor.process'),
                    cell: (process) => process,
                },
                {
                    headerLabel: this.$t('conveyor.num_conveyor'),
                    cell: (process) => this.getConveyorCountProcess(process),
                },
                {
                    headerLabel: this.$t('conveyor.capacity'),
                    cell: (_, index) => {
                        if (index === 1)
                            return `${this.workload_conveyor_storage_in} % | ${this.workload_conveyor_storage_out} %`;
                        else
                            return this.workloadConveyor[index * 2] + " %"
                    },
                },
                {
                    headerLabel: this.$t('conveyor.crash_delay'),
                    cell: (_, index) => Math.round(this.crash_time[index * 2] / 60) + " min",
                },
            ];
        },
        costConveyorTable() {
            return [
                {
                    headerLabel: this.$t('conveyor.repair_cost'),
                    cell: () => this.toCurrency(this.repairCost),
                },
                {
                    headerLabel: this.$t('conveyor.repair_duration'),
                    cell: () => this.repairDuration + " min",
                },
                {
                    headerLabel: this.$t('conveyor.maintenance_cost'),
                    cell: () => this.toCurrency(this.maintenanceCost),
                },
            ];
        },
        futureConveyorTable() {
            return [
                {
                    headerLabel: this.$t('conveyor.name'),
                    cell: (dynamic) => this.translateConveyor(dynamic.conveyor.name),
                },
                {
                    headerLabel: this.$t('conveyor.ordered_in_round'),
                    cell: (dynamic) => dynamic.roundBought,
                },
                {
                    headerLabel: this.$t('conveyor.delivery_round'),
                    cell: (dynamic) =>
                        dynamic.roundBought + dynamic.conveyor.timeToDelivery,
                },
            ];
        },
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-rows: 5rem calc((100vh - 6rem) / 3) calc((100vh - 6rem) / 3) calc((100vh - 6rem) / 3);
    grid-template-columns: 1fr 1fr 1fr;
}

.column {
    grid-row: span 3;
}

.list {
    grid-row: span 2;
    grid-column: span 2;
}

header {
    grid-column: span 3;
}
</style>
