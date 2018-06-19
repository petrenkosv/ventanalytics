<template>
  <b-modal id="modalApiTokenHistory"
           title="API token history"
           size="lg"
           ok-only
           ok-title="Close">
    <bar-chart :chart-data="{ labels: chartLabels, datasets: [{ label: 'Request per day', backgroundColor: '#20a8d8', data: chartDataset }] }"
               :options="chartOptions"
               :height="200"/>
  </b-modal>
</template>
<script>
  import BarChart from '../../../components/Charts/bar-chart'

  export default {
    name: 'account-api-token-history',
    components: {
      BarChart
    },
    props: {
      token: {
        type: String,
        default: () => ""
      }
    },
    data() {
      return {
        user: this.$store.state.route.params.id,
        chartOptions: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            yAxes: [{ ticks: { stepSize: 10 } }]
          }
        }
      }
    },
    created() {
      if (this.token) {
        this.$store.dispatch('account/apiTokenHistory', {user: this.user, token: this.token});
      }
    },
    computed: {
      chartLabels () {
        return this.$store.getters['account/apiTokenHistory'].values || [];
      },
      chartDataset () {
        return this.$store.getters['account/apiTokenHistory'].data || [];
      }
    }
  }
</script>
