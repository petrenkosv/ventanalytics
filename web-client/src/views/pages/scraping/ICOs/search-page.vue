<template>
  <div class="animated fadeIn">
    <form data-vv-scope="searchForm" @submit="searchICOs">
      <b-form-group>
        <b-input-group>
          <b-form-input type="text"
                        name="name"
                        placeholder="Enter ICO name"
                        autocomplete="off"
                        v-validate="{required: true}"
                        v-bind:class="{ 'is-invalid': errors.has('searchForm.name') }"
                        v-model="searchName"></b-form-input>
          <b-input-group-append>
            <b-button type="submit" variant="secondary">Search</b-button>
            <b-button type="button" variant="primary" :to="'/scraping/icos/new'">New ICO</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </form>
    <icoList/>
  </div>
</template>
<script>
  import icoList from './ico-list';

  export default {
    name: 'scraping-icos-search-page',
    components: {
      icoList
    },
    data() {
      return {
        searchName: null
      }
    },
    methods: {
      searchICOs(event) {
        event.preventDefault();
        this.$validator.validateAll('searchForm').then(result => {
          if (result) {
            this.$store.dispatch('scrapingICOs/searchICOs', this.searchName);
          }
        })
      }
    }
  }
</script>
