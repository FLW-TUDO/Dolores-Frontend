<template>
    <div class="box">
        <container :title="$t('dashboard.message', 2)">
            <custom-table :columns="messageColumns" :items="messages"/>
        </container>
        <container :title="$t('dashboard.transport_overview')">
            <custom-table :columns="palletColumns" :items="[transportedPallets, nottransportedPallets]"/>
        </container>
    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import {mapGetters} from "vuex";
import CustomTable from "../custom/Custom-Table.vue";

export default {
    components: {Container, CustomTable},
    computed: {
        ...mapGetters({
            messages: "messages",
            transportedPallets: "transportedPallets",
            nottransportedPallets: "nottransportedPallets",
            transportedPalletsLaIn: "transportedPalletsLaIn",
            transportedPalletsLaOut: "transportedPalletsLaOut",
            nottransportedPalletsLaIn: "nottransportedPalletsLaIn",
            nottransportedPalletsLaOut: "nottransportedPalletsLaOut",
        }),
        messageColumns() {
            return [
                {
                    headerLabel: this.$t('common.round_num'),
                    cell: (message) => message.roundNumber,
                },
                {
                    headerLabel: this.$t('dashboard.message'),
                    cell: (message) => {
                      if (this.$i18n.locale === "de") {
                        return message.messageDE;
                      } else {
                        return message.messageEN;
                      }
                    },
                },
            ];
        },
        palletColumns() {
            return [
                {
                    headerLabel: "",
                    cell: (list, index) => {
                        switch (index) {
                            case 0:
                                return this.$t('dashboard.transported_pallets')
                            default:
                                return this.$t('dashboard.not_transported_pallets')
                        }
                    },
                },
                {
                    headerLabel: this.$t('common.unloading'),
                    cell: (list) => list[0],
                },
                {
                    headerLabel: this.$t('common.receipt_of_goods'),
                    cell: (list) => list[1],
                },
                {
                    headerLabel: this.$t('common.storing'),
                    cell: (list, itemIndex) => {
                        switch (itemIndex) {
                            case 0:
                                return this.transportedPalletsLaIn;
                            default:
                                return this.nottransportedPalletsLaIn
                        }
                    },
                },
                {
                    headerLabel: this.$t('common.storage'),
                    cell: (list) => list[2],
                },
                {
                    headerLabel: this.$t('common.removal'),
                    cell: (list, itemIndex) => {
                        switch (itemIndex) {
                            case 0:
                                return this.transportedPalletsLaOut;
                            default:
                                return this.nottransportedPalletsLaOut
                        }
                    }
                },
                {
                    headerLabel: this.$t('common.outgoing_goods_control'),
                    cell: (list) => list[3],
                },
                {
                    headerLabel: this.$t('common.loading'),
                    cell: (list) => list[4],
                },
            ]
        }
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-rows: 65vh 30vh;
}
</style>
