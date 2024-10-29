<template>
    <div>
        <custom-modal
            v-show="showModal"
            name="orderModal"
            @close="showModal = false"
        >
            <template v-slot:header>{{$t('order.order')}}</template>
            <template v-slot:body>
                <table>
                    <tbody>
                    <tr>
                        <td>{{$t('common.article_name')}}:</td>
                        <td>{{ articleName }}</td>
                        <td>{{$t('order.order_quantity')}}:</td>
                        <td>{{ order_quantity }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('article.discount_level')}}:</td>
                        <td>{{ discountLevel }}</td>
                        <td>{{$t('article.pallet_costs')}}:</td>
                        <td>{{ toCurrency(palletPrice) }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('order.delivery_round')}}:</td>
                        <td>{{ deliveryRound }}</td>
                        <td>{{$t('article.delivery_costs')}}:</td>
                        <td>{{ toCurrency(deliveryCost) }}</td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <table>
                    <tbody>
                    <tr>
                        <td>{{$t('order.product_cost')}}:</td>
                        <td>{{ toCurrency(totalArticleOrderCost) }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('article.delivery_costs')}}:</td>
                        <td>{{ toCurrency(totalDeliveryCost) }}</td>
                    </tr>
                    <tr>
                        <td>{{$t('article.order_fix_costs')}}:</td>
                        <td>{{ toCurrency(orderFixCost) }}</td>
                    </tr>
                    <tr>
                        <th>{{$t('order.total_costs')}}:</th>
                        <th>{{ toCurrency(totalOrderCost) }}</th>
                    </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:footer>
                <custom-button style="width:150px" @click="submitOrder"
                >{{$t('order.order_now')}}
                </custom-button
                >
                <custom-button style="width:150px" @click="showModal = false"
                >{{$t('common.cancel')}}
                </custom-button
                >
            </template>
        </custom-modal>
    </div>
    <div>
        <custom-rotated-table :items="[{id:0}]" :rows="orderFormTable" :title="$t('order.order_form')">
            <template #quantityInput>
                <custom-input v-model="order_quantity" type="number"/>
            </template>
            <template #deliveryTypeInput>
                <custom-select v-model="chosen_type">
                    <option v-for="type in this.getDeliveryTypes()" :key="type">{{ type }}</option>
                </custom-select>
            </template>
            <template #orderButton>
                <custom-button @click="showModal = true">{{$t('order.order_now')}}</custom-button>
            </template>
        </custom-rotated-table>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import CustomModal from "../custom/Custom-Modal.vue";
import CustomButton from "../custom/Custom-Button.vue";
import CustomSelect from "../custom/Custom-Select.vue";
import CustomRotatedTable from "../custom/Custom-Rotated-Table.vue";
import CustomInput from "../custom/Custom-Input.vue";
import {toCurrency} from "@/functions/currency";

export default {
    components: {CustomButton, CustomSelect, CustomInput, CustomModal, CustomRotatedTable},
    props: {
        articleName: {
            type: String,
            required: true
        },
        articleNumber: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            chosen_type: this.$t('order.normal_delivery'),
            order_quantity: 0,
            showModal: false,
        };
    },
    methods: {
        toCurrency(value) {
            return toCurrency(value);
        },
        getDeliveryTypes() {
          return [this.$t('order.normal_delivery'), this.$t('order.express_delivery')]
        },
        submitOrder() {
            this.showModal = false;
            let quantity = parseInt(this.order_quantity);
            this.order_quantity = 0;
            if (quantity < 1) return;
            this.$store.dispatch("order", {
                stateId: this.stateId,
                orderNumber: Math.floor(100000 + Math.random() * 900000),
                orderRound: this.roundNumber,
                deliveryRound: this.deliveryRound,
                deliveryWishRound: this.deliveryRound,
                articleNumber: this.articleNumber,
                realPurchasePrice: this.palletPrice,
                quantity: quantity,
                deliveredQuantity: quantity,
                fixCosts: this.orderFixCost,
                deliveryCosts: this.deliveryCost,
            });
        },
    },
    computed: {
        ...mapGetters({
            stateId: "currentStateId",
            roundNumber: "roundNumber",
        }),
        orderFormTable() {
            return [
                {
                    headerLabel: this.$t('common.article_name'),
                    cell: () => this.articleName,
                },
                {
                    headerLabel: this.$t('order.order_quantity'),
                    cell: "quantityInput",
                },
                {
                    headerLabel: this.$t('article.delivery_type'),
                    cell: "deliveryTypeInput",
                },
                {
                    headerLabel: this.$t('order.delivery_round'),
                    cell: () => this.deliveryRound,
                },
                {
                    headerLabel: "",
                    cell: "orderButton",
                },
            ]
        },
        articleDynamic() {
            return this.$store.getters.articleDynamic(parseInt(this.articleNumber));
        },
        deliveryRound() {
            if (this.chosen_type === this.$t('order.express_delivery')) return this.roundNumber + this.articleDynamic.article.delivery[1].duration;
            else return this.roundNumber + 3;
        },
        totalOrderCost() {
            return (
                this.totalArticleOrderCost + this.totalDeliveryCost + this.orderFixCost
            );
        },
        totalArticleOrderCost() {
            return this.order_quantity * this.palletPrice;
        },
        totalDeliveryCost() {
            return this.order_quantity * this.deliveryCost;
        },
        palletPrice() {
            switch (this.discountLevel) {
                case 0:
                    return this.articleDynamic.article.purchasePrice;
                case 1:
                    return this.articleDynamic.article.discount[0].purchasePrice;
                case 2:
                    return this.articleDynamic.article.discount[1].purchasePrice;
                default:
                    return 1;
            }
        },
        deliveryCost() {
            if (this.chosen_type === this.$t('order.express_delivery'))
                return this.articleDynamic.article.delivery[1].price;
            return this.articleDynamic.article.delivery[0].price;
        },
        orderFixCost() {
            return this.articleDynamic.article.fixOrderCost;
        },
        discountLevel() {
            for (
                let i = this.articleDynamic.article.discount.length;
                i > 0;
                i--
            ) {
                if (
                    this.order_quantity >=
                    this.articleDynamic.article.discount[i - 1].minQuantity
                )
                    return i;
            }
            return 0;
        },
    },
};
</script>

<style scoped>
table {
    text-align: left;
    margin: 0 auto;
}
</style>
