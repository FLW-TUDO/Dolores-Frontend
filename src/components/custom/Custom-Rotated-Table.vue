<template>
  <div class="table-wrapper">
    <table>
      <thead>
      <tr>
        <th colspan="2">{{ title }}</th>
      </tr>

      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <th>{{ row.headerLabel }}</th>
        <td v-for="(item, itemIndex) in items" :key="item._id">
          <slot
              v-if="hasColumnSlot(row)"
              :index="itemIndex"
              :item="item"
              :name="row.cell"
          />
          <span v-else> {{ row.cell(item, itemIndex) }} </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 * Simple rotated table component -> take a look at its props
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
    rows: {
      type: Array,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: ""
    }
  },

  methods: {
    hasColumnSlot(row) {
      return typeof row.cell == "string";
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  background-color: inherit;
  width: 100%;
  text-align: left;
}

table thead tr {
  background-color: #007598;
  color: #ffffff;
  text-align: left;
}

table th, table td {
  padding: 12px 15px;
}

table thead th:last-child {
  border-radius: 10px 10px 0 0;
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
  overflow-y: auto;
  max-height: 100%;
}

</style>
