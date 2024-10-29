<template>
    <div class="box">
        <header>
            <h1>{{$t('order.order_view')}}</h1>
        </header>

        <container :title="$t('order.current_stock')">
            <custom-table :columns="articleStockInfoTable" :items="articleDynamics"/>
        </container>

        <container :title="$t('order.customer_jobs')">
          <custom-table :columns="currentJobsInfoTable" :items="articleDynamics"/>
        </container>

        <container class="bar" :title="$t('order.open_orders')">
            <custom-table :columns="openOrderInfoTable" :items="orders"/>
        </container>

        <div></div>

        <container class="bar" :title="$t('order.outstanding_customer_jobs')">
            <custom-table :columns="delayedJobsInfoTable" :items="articleDynamics"/>
        </container>

    </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {mapGetters} from "vuex";
import {toCurrency} from "@/functions/currency";

export default {
    components: {Container, CustomTable},
    data() {
      return {
        articleNames: [this.$t('side_menu.exhaust'), this.$t('side_menu.break_disk'), this.$t('side_menu.taillight'), this.$t('side_menu.shock_absorber'),],
      }
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
        },
        getArticleName(articleNumber) {
            return this.articleNames[articleNumber - 100101];
        },
        getArticleNameTranslation(name) {
          //TODO: fix me
          switch (name) {
            case "Auspuff": return this.$t('side_menu.exhaust')
            case "Bremsscheibe": return this.$t('side_menu.break_disk')
            case "Bremsscheiben": return this.$t('side_menu.break_disk')
            case "Rückleuchte" : return this.$t('side_menu.taillight')
            case "Rückleuchten" : return this.$t('side_menu.taillight')
            case "Stossdämpfer" : return this.$t('side_menu.shock_absorber')
            default : return name;
          }
        },
        getPalletDemand(articleNumber) {
            let quantity = 0;
            this.customerJobs.forEach((job) => {
                if (
                    job.articleNumber === articleNumber &&
                    job.demandRound === this.roundNumber
                )
                    quantity += job.quantity;
            });
            return quantity;
        },
        getDelayedPalletDemand(articleNumber) {
            let quantity = 0;
            this.customerJobs.forEach((job) => {
                if (
                    job.articleNumber === articleNumber &&
                    job.demandRound < this.roundNumber
                )
                    quantity += job.quantity;
            });
            return quantity;
        },
    },
    computed: {
        ...mapGetters({
            articleDynamics: "articleDynamics",
            orders: "orders",
            customerJobs: "customerJobs",
            roundNumber: "roundNumber",
        }),
        articleStockInfoTable() {
            return [
                {
                    headerLabel: this.$t('common.article_name'),
                    cell: (dynamic) => this.getArticleNameTranslation(dynamic.article.name),
                },
                {
                    headerLabel: this.$t('order.in_stock'),
                    cell: (dynamic) => dynamic.currentStock,
                },
                {
                    headerLabel: this.$t('order.stock_value'),
                    cell: (dynamic) => this.toCurrency(dynamic.currentStock * dynamic.article.salesPrice),
                },
            ]
        },
        openOrderInfoTable() {
            return [
                {
                    headerLabel: this.$t('common.article_name'),
                    cell: (order) => this.getArticleNameTranslation(this.getArticleName(order.articleNumber)),
                },
                {
                    headerLabel: this.$t('order.order_round'),
                    cell: (order) => order.orderRound,
                },
                {
                    headerLabel: this.$t('order.pallet', 2),
                    cell: (order) => order.quantity,
                },
                {
                    headerLabel: this.$t('order.delivery_round'),
                    cell: (order) => order.deliveryWishRound,
                },
            ]
        },
        currentJobsInfoTable() {
            return [
                {
                    headerLabel: this.$t('common.article_name'),
                    cell: (dynamic) => this.getArticleNameTranslation(dynamic.article.name),
                },
                {
                    headerLabel: this.$t('order.pallet', 2),
                    cell: (dynamic) => this.getPalletDemand(dynamic.article.articleNumber),
                },
                {
                    headerLabel: this.$t('order.stock_value'),
                    cell: (dynamic) => this.toCurrency(this.getPalletDemand(dynamic.article.articleNumber) * dynamic.article.salesPrice),
                },
            ]
        },
        delayedJobsInfoTable() {
            return [
                {
                    headerLabel: this.$t('common.article_name'),
                    cell: (dynamic) => this.getArticleNameTranslation(dynamic.article.name),
                },
                {
                    headerLabel: this.$t('order.pallet', 2),
                    cell: (dynamic) => this.getDelayedPalletDemand(dynamic.article.articleNumber),
                },
                {
                    headerLabel: this.$t('order.stock_value'),
                    cell: (dynamic) => this.toCurrency(this.getDelayedPalletDemand(dynamic.article.articleNumber) * dynamic.article.salesPrice),
                },
            ]
        }
    },
};
</script>

<style scoped>
.box {
    display: grid;
    grid-template-rows: 5rem calc((100vh - 6rem) / 2) calc((100vh - 6rem) / 2);
    grid-template-columns: 1fr 1fr 1fr;
}

.bar {
    grid-row: span 2;
}

header {
    grid-column: span 3;
}
</style>