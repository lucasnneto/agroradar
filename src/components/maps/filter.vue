<template>
  <v-dialog
    v-model="cmpModal"
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card class="pa-5">
      <div class="d-flex mb-3">
        <v-btn icon color="primary" class="mr-2" @click="closeModal">
          <v-icon x-large>mdi-close</v-icon>
        </v-btn>
        <h1>Mapa com filtros</h1>
      </div>
      <v-lazy>
        <l-map style="height:350px;overflow:hidden" :zoom="6" :center="center">
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
      </v-lazy>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { getUFs } from "@/mixins/utils";
export default Vue.extend({
  computed: {
    ...mapState("plague", ["items", "modal", "item"]),
    plagues() {
      if (this.items.lenght <= 0) return [];
      return this.items.filter((el: any) => {
        return el.farmId && el.farmId.position;
      });
    },
    center() {
      const locais: any = getUFs();
      return locais[this.item.state];
    },
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    cmpModal: {
      get() {
        return this.modal === "FILTER";
      },
      set(value) {
        if (!value) this.$store.dispatch("plague/CHANGE", { modal: "" });
      },
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
  },
  data: () => ({}),
});
</script>
