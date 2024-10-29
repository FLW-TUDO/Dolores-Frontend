<template>
    <div class="table-wrapper">
        <table>
            <thead>
            <tr>
                <th v-for="(column, index) in columns" :key="index">
                    {{ column.headerLabel }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, itemIndex) in items" :key="item._id">
                <td v-for="(column, index) in columns" :key="index">
                    <slot
                        v-if="hasColumnSlot(column)"
                        :index="itemIndex"
                        :item="item"
                        :name="column.cell"
                    />
                    <span v-else> {{ column.cell(item, itemIndex) }} </span>
                </td>
            </tr>
            <tr v-if="items.length === 0">
                <th colspan="10">{{$t('common.no_entry')}}</th>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
/**
 * Simple table component -> take a look at its props
 */
export default {
    props: {
        /**
         * [
         *   {
         *     headerLabel: String,
         *     cell: String | Function (item) => item.subvalue
         *   }
         * ]
         */
        columns: {
            type: Array,
            required: true,
        },

        items: {
            type: Array,
            required: true,
        },
    },

    methods: {
        hasColumnSlot(column) {
            return typeof column.cell == "string";
        },
    },
};
</script>

<style scoped>
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

table th:first-child {
    border-radius: 10px 0 0 0;
    -moz-border-radius: 10px 0 0 0;
    -webkit-border-radius: 10px 0 0 0;
}

table th:last-child {
    border-radius: 0 10px 0 0;
    -moz-border-radius: 0 10px 0 0;
    -webkit-border-radius: 0 10px 0 0;
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

.table-wrapper {
    overflow: auto;
    max-height: 90%;
}
</style>
