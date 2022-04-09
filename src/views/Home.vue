<template>
  <div class="fill-height d-flex relative justify-end align-center">
    <l-map
      class="absolute"
      style="height:100vh;z-index: 0;"
      :zoom="9"
      :center="center"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <div v-for="area in plagues" :key="area._id">
        <l-circle
          :lat-lng="[area.farmId.position.lat, area.farmId.position.long]"
          :radius="area.farmId.position.radius"
          :color="$vuetify.theme.themes.light.primary.darken2"
          :fillColor="$vuetify.theme.themes.light.primary.darken2"
        >
          <l-popup :options="{ minWidth: 180 }">
            <p class="mb-5 text-center">Casos de</p>
            <div class="d-flex flex-column justify-center text-center">
              <img
                v-if="area.photo.length === 0"
                src="@/assets/gafanhoto.svg"
                class="mb-3"
                height="30"
              />
              <div v-else class="d-flex justify-center">
                <img
                  :src="area.photo[0]"
                  class="mb-3"
                  height="150"
                  width="150"
                />
              </div>

              <h2>{{ area.name }}</h2>
            </div>
          </l-popup>
        </l-circle>
      </div>
    </l-map>
    <img
      src="@/assets/AgroRadar.png"
      class="absolute mt-5"
      :style="!isMobile ? 'top: 0;left: 50%;' : 'top: 0px;'"
      width="200"
    />
    <v-btn
      elevation="2"
      fab
      x-large
      color="primary"
      class="absolute mr-12"
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
          this.$store.dispatch("auth/CHANGE", {
            local: [crd.latitude, crd.longitude],
          });
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
    plagues() {
      if (this.items.length <= 0) return [];
      return this.items.filter((el: any) => {
        return el.farmId && el.farmId.position;
      });
    },
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
  data: () => ({
    center: [-19.7483, -47.9169],
  }),
});
</script>
