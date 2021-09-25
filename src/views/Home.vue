<template>
  <div
    class="fill-height d-flex relative"
    :class="isMobile ? 'justify-center align-end' : 'justify-end align-center'"
  >
    <l-map
      class="absolute"
      style="height:100vh;z-index: 0;"
      :zoom="7"
      :center="center"
    >
      <l-tile-layer :url="url"></l-tile-layer>
    </l-map>
    <v-btn
      elevation="2"
      fab
      x-large
      class="absolute"
      :class="isMobile ? 'mb-8' : 'mr-12'"
      @click="openModal"
    >
      <img src="@/assets/leaf.svg" />
    </v-btn>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import http from "@/service/axios";

export default Vue.extend({
  name: "Home",
  created() {
    http
      .get("https://praga-production.up.railway.app/plague/list")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          const crd = position?.coords;
          this.center = [crd.latitude, crd.longitude];
        },
        async (error: any) => {
          console.error(error);
          if (!navigator.vendor.includes("Apple")) {
            await navigator.permissions.query({ name: "geolocation" });
          }
        }
      );
    }
  },
  methods: {
    openModal() {
      this.$router.push({ name: "sign" });
    },
  },
  computed: {
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
  data: () => ({
    center: [-18.9225925, -48.2652564],
  }),
});
</script>
