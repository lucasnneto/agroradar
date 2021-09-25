<template>
  <h1>aaa</h1>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  created() {
    console.log(process.env.VUE_APP_SOMEKEY);
  },
});
</script>
