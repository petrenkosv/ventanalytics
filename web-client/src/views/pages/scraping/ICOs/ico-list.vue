<template>
  <div id="icoList">
    <template v-for="ico in icos" v-if="icosLength > 0">
      <icoItem :ico="ico"/>
    </template>
    <div class="text-center mt-5" v-if="icosLength === 0">
      <h2><i class="fa fa-hand-o-up mr-2"></i> Type for searching.</h2>
    </div>
  </div>
</template>
<script>
  import icoItem from './ico-item';

  export default {
    name: "scraping-icos-list",
    components: {
      icoItem
    },
    computed: {
      icos () {
        return this.$store.getters['scrapingICOs/getAllIcos'];
      },
      icosLength () {
        return this.$store.state.scrapingICOs.icosLength;
      }
    }
  }
</script>
