<template>
  <div>
    <custom-modal
        v-show="cancelOrderModalVisible"
        name="fireModal"
        @close="cancelOrderModalVisible = false"
    >
      <template v-slot:header>{{ $t('order.dia_cancel') }}</template>
      <template v-slot:body>
        <span>
            {{ $t('order.dia_cancel_info', { quantity: currentSelectedQuantity, articleName: currentSelectedOrderArticleName }) }}
          </span>
        <br/>
        <br/>
        <span>
            {{ $t('order.dia_cancel_cost', { money: toCurrency(currentSelectedCompensation) }) }}
          </span>
        <br/>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="cancelOrder()">
          {{$t('common.accept')}}
        </custom-button>
        <custom-button style="width:150px" @click="cancelOrderModalVisible = false">
          {{$t('common.cancel')}}
        </custom-button>
      </template>
    </custom-modal>
  </div>
  <div class="box">
    <header>
      <h1>{{ articleName }}</h1>
    </header>
    <container class="graph">
      <div>
        <h3>{{$t('article.current_stock')}}</h3>
        <custom-chart :input="articleStockData" id="" type="line" :label="getChartLabelTranslation()"/>
      </div>
      <div>
        <custom-rotated-table :items="[articleDynamic]" :rows="articleInfoTable" :title="$t('article.information')"/>
      </div>
    </container>

    <container>
      <custom-rotated-table :items="[articleDynamic]" :rows="articleOrderTable" :title="$t('article.order_information')"/>

      <custom-table :columns="articleDiscountTable" :items="articleDynamic.article.discount"/>
    </container>

    <container class="bar">
      <custom-table :columns="deliveryCostTable" :items="articleDynamic.article.delivery"/>
      <h3>{{$t('order.open_orders')}}</h3>
      <custom-table style="max-height: 50%" :columns="orderInfoTable" :items="ordersByArticle">
        <template #cancleOrder="slotProps">
          <custom-button
              @click="openCancelOrderModal(slotProps.item.id)"
          >
            {{ $t('article.cancel') }}
          </custom-button>
        </template>
      </custom-table>
    </container>

    <container>
      <order-form
          :articleName="articleName"
          :articleNumber="articleNumber"
      ></order-form>
    </container>
  </div>
</template>

<script>
import Container from "../custom/Custom-Container.vue";
import OrderForm from "./orderForm.vue";
import CustomRotatedTable from "../custom/Custom-Rotated-Table.vue";
import CustomTable from "../custom/Custom-Table.vue";
import {mapGetters} from "vuex";
import CustomChart from "../custom/Custom-Chart";
import CustomButton from "../custom/Custom-Button";
import CustomModal from "@/components/custom/Custom-Modal";

import {fetchGETHeader} from "@/middleware/communication.handle";
import {toCurrency} from "@/functions/currency";

export default {
  components: {Container, OrderForm, CustomRotatedTable, CustomTable, CustomChart, CustomButton, CustomModal},
  props: {
    articleNumber: {
      type: Number,
      default: 100101,
    },
  },
  data() {
    return {
      articleStockData: {},
      deliveryTypes : [this.$t('order.normal_delivery'), this.$t('order.express_delivery')],
      cancelOrderModalVisible : false,
      currentSelection : undefined
    }
  },
  methods: {
    getChartLabelTranslation() {
      return this.$t('article.current_stock')
    },
    cancelOrder() {
      if (!this.currentSelection) return;
      this.cancelOrderModalVisible = false;
      this.$store.dispatch("cancelOrder", {
        stateId: this.stateId,
        orderId: this.currentSelection,
      });
      this.currentSelection = undefined;
    },
    toCurrency(value) {
      return toCurrency(value);
    },
    openCancelOrderModal(orderId) {
      this.currentSelection = orderId;
      this.cancelOrderModalVisible = true;
    },
    async updateChart() {
      this.articleStockData = {}
      fetchGETHeader(`gameInfos/${this.currentGameId}/articles/${this.articleNumber}/paststock`, this.$store.getters.currentUserToken)
          .then(data => {
            if (data.data[data.data.length - 1] !== this.articleDynamic.currentStock)
              return;
            this.articleStockData = {
              'data': data.data,
              'labels': data.labels,
            }
          })
    }
  },
  created() {
    this.updateChart();
  },
  watch: {
    articleNumber(){
      this.updateChart();
    }
  },
  computed: {
    ...mapGetters({
      freeStocks: "freeStocks",
      orders: "orders",
      stateId : "currentStateId",
      currentGameId: "currentGameId",
      roundNumber : "roundNumber",
      orderCancelCost: "orderCancelCost"
    }),
    articleDynamic() {
      return this.$store.getters.articleDynamic(this.articleNumber);
    },
    articleName() {
      switch (this.articleDynamic.article.name) {
        case "Auspuff": return this.$t('side_menu.exhaust')
        case "Bremsscheibe": return this.$t('side_menu.break_disk')
        case "Rückleuchte" : return this.$t('side_menu.taillight')
        case "Stossdämpfer" : return this.$t('side_menu.shock_absorber')
        default : return this.articleDynamic.article.name;
      }
    },
    discount() {
      return this.articleDynamic.article.discountLevel;
    },
    ordersByArticle() {
      return this.orders.filter(order => order.articleNumber === this.articleNumber);
    },
    currentSelectedQuantity() {
      if (this.currentSelection === undefined) return;
      let order = this.orders.find(order => order.id === this.currentSelection);
      return order.quantity;
    },
    currentSelectedOrderArticleName() {
      if (this.currentSelection === undefined) return;
      let order = this.orders.find(order => order.id === this.currentSelection);
      return order.articleNumber;
    },
    currentSelectedCompensation() {
      if (this.currentSelection === undefined) return;
      let order = this.orders.find(order => order.id === this.currentSelection);
      let deliveryDuration = order.deliveryRound - this.roundNumber;
      let costs = this.orderCancelCost[deliveryDuration];
      return Math.floor( order.quantity * order.realPurchasePrice * costs + order.fixCosts);
    },
    articleInfoTable() {
      return [
        {
          headerLabel: this.$t('common.article_name'),
          cell: () => this.articleName,
        },
        {
          headerLabel: this.$t('common.article_number'),
          cell: (dynamic) => dynamic.article.articleNumber,
        },
        {
          headerLabel: this.$t('article.currently_in_stock'),
          cell: (dynamic) => dynamic.currentStock,
        },
        {
          headerLabel: this.$t('article.mean_consumption'),
          cell: (dynamic) => dynamic.averageConsumption,
        },
        {
          headerLabel: this.$t('article.range'),
          cell: (dynamic) => dynamic.estimatedRange,
        },
        {
          headerLabel: this.$t('article.stock_value'),
          cell: (dynamic) => this.toCurrency(dynamic.currentStock * dynamic.article.salesPrice),
        },
      ]
    },
    articleOrderTable() {
      return [
        {
          headerLabel: this.$t('article.purchase_price'),
          cell: (dynamic) => this.toCurrency(dynamic.article.purchasePrice),
        },
        {
          headerLabel: this.$t('article.min_order_quantity'),
          cell: (dynamic) => dynamic.article.minOrder,
        },
        {
          headerLabel: this.$t('article.order_fix_costs'),
          cell: (dynamic) => this.toCurrency(dynamic.article.fixOrderCost),
        },
        {
          headerLabel: this.$t('article.sales_price'),
          cell: (dynamic) => this.toCurrency(dynamic.article.salesPrice),
        },
      ]
    },
    articleDiscountTable() {
      return [
        {
          headerLabel: this.$t('article.discount_level'),
          cell: (discountLevel) => discountLevel.level,
        },
        {
          headerLabel: this.$t('article.min_discount_quantity'),
          cell: (discountLevel) => discountLevel.minQuantity,
        },
        {
          headerLabel: this.$t('article.pallet_costs'),
          cell: (discountLevel) => this.toCurrency(discountLevel.purchasePrice),
        },
      ]
    },
    deliveryCostTable() {
      return [
        {
          headerLabel: this.$t('article.delivery_type'),
          cell: (deliveryType, index) => this.deliveryTypes[index],
        },
        {
          headerLabel: this.$t('article.delivery_time'),
          cell: (deliveryType) => this.$t('article.delivery_time_rounds', deliveryType.duration, {count: deliveryType.duration}),
        },
        {
          headerLabel: this.$t('article.delivery_costs'),
          cell: (deliveryType) => this.toCurrency(deliveryType.price),
        },
      ]
    },
    orderInfoTable() {
      return [
        {
          headerLabel: this.$t('common.article_name'),
          cell: () => this.articleName,
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
        {
          headerLabel: "",
          cell: "cancleOrder"
        }
      ]
    }
  },
};
</script>

<style scoped>
.box {
  display: grid;
  grid-template-rows: 5rem calc((90vh - 6rem) / 2) calc((110vh - 6rem) / 2);
  grid-template-columns: 1fr 2fr 1fr;
}

.bar {
  grid-row: span 1;
}

.graph {
  grid-column: span 3;
  display: grid;
  grid-template-columns: 1fr 2fr;
}

header {
  grid-column: span 3;
}
</style>
