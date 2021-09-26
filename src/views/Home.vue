<template>
  <div
    class="fill-height d-flex relative"
    :class="isMobile ? 'justify-center align-end' : 'justify-end align-center'"
  >
    <l-map
      class="absolute"
      style="height:100vh;z-index: 0;"
      :zoom="9"
      :center="center"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-circle
        v-for="area in items"
        :key="area._id"
        :lat-lng="[area.farmId.position.lat, area.farmId.position.long]"
        :radius="area.farmId.position.radius"
        :color="$vuetify.theme.themes.light.primary.darken2"
        :fillColor="$vuetify.theme.themes.light.primary.darken2"
      >
        <l-popup :options="{ minWidth: 180 }">
          <div class="d-flex flex-column justify-center text-center">
            <img src="@/assets/gafanhoto.svg" class="mb-3" height="30" />
            <h1 class="mb-1">1.300</h1>
            <p class="mb-5">Casos</p>
            <h2>Gafanhoto</h2>
          </div>
        </l-popup>
      </l-circle>
    </l-map>
    <v-btn
      elevation="2"
      fab
      x-large
      color="primary"
      class="absolute"
      :class="isMobile ? 'mb-8' : 'mr-12'"
      @click="openModal"
    >
      <v-icon size="38">mdi-login-variant</v-icon>
    </v-btn>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Home",
  async created() {
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
    await this.$store.dispatch("plague/GET_LIST");
  },
  methods: {
    openModal() {
      this.$router.push({ name: "sign" });
    },
  },
  computed: {
    ...mapState("plague", ["items"]),
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
  data: () => ({
    center: [-19.7483, -47.9169], //[-18.9225925, -48.2652564],
  }),
});
</script>
