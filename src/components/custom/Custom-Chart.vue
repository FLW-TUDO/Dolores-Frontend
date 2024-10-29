<template>
  <div :id="`box-${id}`" class="chart-box">
    <canvas :id="`chart-${id}`" class="chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "Custom-Chart",
  data() {
    return {
      chart: null,
    }
  },
  props: {
    type: {type: String, default: 'line'},
    /**
     * {
     *     data: {type: Array, required: true},
     *     labels: {type: Array, required: true},
     * }
     */
    input: {
      type: Object, default: () => {
        return {data: [], labels: []}
      }, required: true
    },
    label: {type: String, default: '', required: false},
    id: {type: String, required: true},
  },
  methods: {
    async renderChart() {
      const data = {
        labels: this.input.labels,
        datasets: [{
          label: this.label,
          data: this.input.data,
          fill: false,
          borderColor: '#007598',
          tension: 0
        }]
      }
      try {
        const ctx = document.getElementById(`chart-${this.id}`).getContext('2d');
        this.chart = new Chart(ctx, {
          type: this.type,
          data: data,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            animation: {
              duration: 0, // general animation time
            },
            hover: {
              animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
          }
        });
      } catch (error) {
        console.log(error)
      }
    },
  },
  async mounted() {
    await this.renderChart();
  },
  watch: {
    async input() {
      document.getElementById(`chart-${this.id}`).remove();
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", `chart-${this.id}`);
      canvas.setAttribute("class", "chart");
      const div = document.getElementById(`box-${this.id}`);
      div.appendChild(canvas);
      await this.renderChart();
    }
  }
}
</script>

<style scoped>
.chart-box {
  margin: 20px;
}
</style>