<template>
    <div>
        <custom-modal
            v-show="infoModalVisible"
            name="infoConveyor"
            @close="infoModalVisible = false"
        >
            <template v-slot:header>{{$t('conveyor.information')}}</template>
            <template v-slot:body>
                <table>
                    <tbody>
                    <tr>
                        <td>{{$t('conveyor.name')}}</td>
                        <td>{{ currentSelectedName }}</td>
                    </tr>
                    <tr>
                      <td>{{$t('conveyor.needs_forklift_permit')}}</td>
                      <td>{{ needForkliftPermit ? this.$t('common.yes') : this.$t('common.no') }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('conveyor.price')}}</td>
                        <td>{{ toCurrency(currentSelectedPrice) }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('conveyor.speed')}}</td>
                        <td>{{ currentSelectedSpeed }} m/s</td>
                    </tr>
                    <tr>
                        <td>{{$t('conveyor.maintenance_cost')}}</td>
                        <td>{{ toCurrency(currentSelectedMaintenanceCost) }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('conveyor.overhaul_cost')}}</td>
                        <td>{{ toCurrency(currentSelectedOverhaulCost) }}</td>
                    </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
        </custom-modal>
        <custom-modal
            v-show="sellModalVisible"
            name="sellConveyor"
            @close="sellModalVisible = false"
        >
            <template v-slot:header>{{$t('conveyor.dia_sell')}}</template>
            <template v-slot:body>
                <span>{{$t('conveyor.dia_sell_info', {conveyorName: currentSelectedName})}} </span>
                <br/>
                <br/>
                <span> {{$t('conveyor.dia_sell_profit', {money: toCurrency(currentSelectedValue)})}}</span>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="sellConveyor()">
                  {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="sellModalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
        <custom-modal
            v-show="buyModalVisible"
            name="buyConveyor"
            @close="buyModalVisible = false"
        >
            <template v-slot:header>{{$t('conveyor.dia_buy')}}</template>
            <template v-slot:body>
                <span>{{$t('conveyor.dia_buy_info', {conveyorName:currentSelectedName})}} </span>
                <br/>
                <br/>
                <span>{{$t('conveyor.dia_buy_cost', {money: toCurrency(currentSelectedPrice)})}} </span>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="buyConveyor()">
                  {{$t('common.accept')}}
                </custom-button>
                <custom-button style="width:150px" @click="buyModalVisible = false">
                  {{$t('common.cancel')}}
                </custom-button>
            </template>
        </custom-modal>
    </div>
    <div>
        <div class="box">
            <header>
                <h1>{{$t('conveyor.conveyor_market')}}</h1>
            </header>

            <container class="list" :title="$t('conveyor.conveyor_market')">
                <custom-table :columns="storeConveyorTable" :items="conveyorStore">
                    <template #buyButton="slotProps">
                        <custom-button @click="openBuyModal(slotProps.item.conveyor.id)"
                        >{{$t('conveyor.buy')}}
                        </custom-button
                        >
                    </template>
                    <template #infoButton="slotProps">
                        <custom-button @click="openInfoModal(slotProps.item.conveyor.id)">{{$t('conveyor.information')}}</custom-button>
                    </template>
                </custom-table>
            </container>

            <container :title="$t('conveyor.current_conveyor')">
                <custom-table
                    :columns="conveyorDataColumns"
                    :items="currentConveyor"
                >
                    <template #sellButton="slotProps">
                        <custom-button
                            v-if="!slotProps.item.sold"
                            @click="openSellModal(slotProps.item.conveyor.id)"
                        >
                          {{ $t('conveyor.sell') }}
                        </custom-button>
                        <span v-else>
                          {{ $t('conveyor.sold') }}
                        </span>
                    </template>
                    <template #infoButton="slotProps">
                        <custom-button @click="openInfoModal(slotProps.item.conveyor.id)">{{$t('conveyor.information')}}</custom-button>
                    </template>
                </custom-table>
            </container>

            <container :title="$t('conveyor.future_conveyor')">
                <custom-table
                    :columns="futureConveyorTable"
                    :items="futureConveyor"
                />
            </container>
        </div>
    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomTable from "../custom/Custom-Table.vue";
import CustomModal from "../custom/Custom-Modal.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
    components: {Container, CustomButton, CustomTable, CustomModal},
    data() {
        return {
            infoModalVisible: false,
            sellModalVisible: false,
            buyModalVisible: false,
            currentSelection: undefined,
            processes: [this.$t('common.unloading'), this.$t('common.receipt_of_goods'), this.$t('common.storage'), this.$t('common.outgoing_goods_control'), this.$t('common.loading'),]
        }
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
        },
        openInfoModal(conveyorId) {
            this.currentSelection = conveyorId;
            this.infoModalVisible = true;
        },
        openSellModal(conveyorId) {
            this.currentSelection = conveyorId;
            this.sellModalVisible = true;
        },
        openBuyModal(conveyorId) {
            this.currentSelection = conveyorId;
            this.buyModalVisible = true;
        },
        sellConveyor() {
            this.$store.dispatch("sellConveyor", {
                stateId: this.stateId,
                conveyorId: this.currentSelection,
            });
            this.sellModalVisible = false;
            this.currentSelection = undefined;
        },
        buyConveyor() {
            this.$store.dispatch("buyConveyor", {
                stateId: this.stateId,
                conveyorId: this.currentSelection,
            });
            this.buyModalVisible = false;
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
            conveyorStore: "conveyorStore",
            stateId: "currentStateId",
        }),
        currentSelectedConveyor() {
            let conveyorId = this.currentSelection;
            let conveyorDynamics = Array().concat(this.conveyorStore, this.conveyorDynamics);
            return conveyorDynamics.find(
                (dynamic) => dynamic.conveyor.id === conveyorId
            );
        },
        currentSelectedName() {
            if (this.currentSelection === undefined) return;
            return this.translateConveyor(this.currentSelectedConveyor.conveyor.name);
        },
        needForkliftPermit() {
          if (this.currentSelection === undefined) return;
          return this.currentSelectedConveyor.conveyor.needsForkliftPermit;
        },
        currentSelectedPrice() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.conveyor.price;
        },
        currentSelectedValue() {
            if (this.currentSelection === undefined) return;
            return Math.floor(this.currentSelectedConveyor.currentValue);
        },
        currentSelectedSpeed() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.conveyor.speed;
        },
        currentSelectedOverhaulCost() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.overhaul_cost;
        },
        currentSelectedMaintenanceCost() {
            if (this.currentSelection === undefined) return;
            return this.currentSelectedConveyor.conveyor.maintenanceCost;
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
        storeConveyorTable() {
            return [
                {
                    headerLabel: this.$t('conveyor.name'),
                    cell: (dynamic) => this.translateConveyor(dynamic.conveyor.name),
                },
                {
                    headerLabel: this.$t('conveyor.delivery_duration'),
                    cell: (dynamic) => dynamic.conveyor.timeToDelivery,
                },
                {
                    headerLabel: this.$t('conveyor.price'),
                    cell: (dynamic) => this.toCurrency(dynamic.conveyor.price),
                },
                {
                    headerLabel: this.$t('conveyor.buy'),
                    cell: "buyButton",
                },
                {
                    headerLabel: this.$t('conveyor.information'),
                    cell: "infoButton",
                },
            ];
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
                    cell: (dynamic) => this.processes[dynamic.process],
                },
                {
                    headerLabel: this.$t('conveyor.value'),
                    cell: (dynamic) => this.toCurrency(dynamic.currentValue),
                },
                {
                    headerLabel: this.$t('conveyor.sell'),
                    cell: "sellButton",
                },
                {
                    headerLabel: this.$t('conveyor.information'),
                    cell: "infoButton",
                },
            ];
        },
        futureConveyor() {
            return this.conveyorDynamics.filter((dynamic) => dynamic.roundBought + dynamic.conveyor.timeToDelivery > this.roundNumber);
        },
        currentConveyor() {
            return this.conveyorDynamics.filter((dynamic) => dynamic.roundBought + dynamic.conveyor.timeToDelivery <= this.roundNumber);
        },
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-rows: 5rem calc((100vh - 6rem) / 2) calc((100vh - 6rem) / 2);
    grid-template-columns: 2fr 1fr;
}

header,
.list {
    grid-column: span 2;
}
</style>
