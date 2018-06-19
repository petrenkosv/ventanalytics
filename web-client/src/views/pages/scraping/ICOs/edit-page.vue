<template>
  <div class="animated fadeIn">
    <icoForm :ico="ico"/>
  </div>
</template>
<script>
  import icoForm from './ico-form';
  export default {
    name: 'scraping-ico-edit-page',
    components: {
      icoForm
    },
    data () {
      return {
        icoId: this.$store.state.route.params.id,
        ico: this.$store.getters['scrapingICOs/getIco'](this.$store.state.route.params.id)
      }
    },
    mounted () {
      if (!this.$store.getters['scrapingICOs/hasICOs']) {
        return this.$router.push('/scraping/icos')
      } else if (!this.$store.getters['scrapingICOs/checkICO'](this.icoId)) {
        return this.$router.push('/404')
      }
    }
  }
</script>
