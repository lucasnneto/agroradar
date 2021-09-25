<template>
  <div class="fill-height d-flex justify-end align-center relative">
    <img
      class="absolute"
      style="height:100vh"
      width="100%"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/World_location_map.svg/800px-World_location_map.svg.png"
    />
    <v-btn elevation="2" fab x-large class="absolute mr-12" @click="openModal">
      <img src="@/assets/leaf.svg" />
    </v-btn>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  methods: {
    openModal() {
      this.$router.push({ name: "sign" });
    },
  },
});
</script>
