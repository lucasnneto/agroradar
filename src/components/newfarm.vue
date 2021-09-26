<template>
  <v-flex class="ma-10">
    <div class="d-flex flex-column">
      <div class="d-flex">
        <v-btn icon color="primary" class="mr-2" @click="closeModal">
          <v-icon x-large>mdi-close</v-icon>
        </v-btn>
        <h1>Nova fazenda</h1>
      </div>
      <v-form ref="form">
        <v-row class="mt-6">
          <v-col :cols="isMobile ? 12 : 6">
            <v-text-field
              outlined
              label="Nome da Fazenda"
              :rules="[rules.required]"
              v-model="name"
            ></v-text-field>
            <v-text-field
              outlined
              label="CEP"
              :rules="[rules.required]"
              v-model="cep"
              v-mask="'##.###-###'"
              append-outer-icon="mdi-magnify"
              @click:append-outer="searchCEP"
            ></v-text-field>
            <v-text-field
              outlined
              label="Rua"
              :rules="[rules.required]"
              v-model="address"
            ></v-text-field>
            <v-text-field
              outlined
              label="Bairro"
              :rules="[rules.required]"
              v-model="district"
            ></v-text-field>
            <div class="d-flex" :class="{ 'flex-column': isMobile }">
              <v-text-field
                outlined
                label="Cidade"
                :class="{ 'mr-4': !isMobile }"
                :rules="[rules.required]"
                v-model="city"
              ></v-text-field>
              <v-select
                :style="!isMobile ? 'width:15%' : ''"
                :items="Ufs"
                v-model="state"
                :rules="[rules.required]"
                outlined
                label="UF"
              ></v-select>
            </div>
            <v-text-field
              outlined
              label="NIRF"
              :rules="[rules.required]"
              v-model="nirf"
            ></v-text-field>
          </v-col>
          <v-col :cols="isMobile ? 12 : 6">
            <h2>Selecione Região</h2>

            <l-map
              ref="map"
              style="height:300px;max-weight:250px;overflow:hidden"
              :zoom="9"
              :center="center"
            >
              <l-tile-layer :url="url"></l-tile-layer>
            </l-map>

            <div class="d-flex justify-space-around text-center my-10">
              <div>
                <h4>
                  -
                </h4>
                <h3>LAT</h3>
              </div>
              <div>
                <h4>
                  -
                </h4>
                <h3>LNG</h3>
              </div>
              <div>
                <h4>
                  -
                </h4>
                <h3>RAIO</h3>
              </div>
            </div>
            <div class="d-flex justify-center">
              <v-btn
                min-width="150"
                height="50"
                color="primary darken-1"
                @click="novoCircle"
                >NOVa região</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-form>
      <div class="d-flex justify-center mt-5">
        <v-btn min-width="150" height="50" color="primary">SALVAR</v-btn>
      </div>
    </div>
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";
import { getTypes } from "@/mixins/utils";
import rules from "@/mixins/rules";
import { removerMask, getUFs } from "@/mixins/utils";
import { mapState } from "vuex";
import http from "@/service/axios";
import L from "leaflet";
import "leaflet-draw";
var drawnItems = new L.FeatureGroup();
export default Vue.extend({
  mixins: [rules],
  mounted() {
    this.$nextTick(() => {
      const map = (this.$refs.map as any).mapObject;

      map.addLayer(drawnItems);
      const drawControl = new (L.Control as any).Draw({
        position: "topright",
        edit: {
          featureGroup: drawnItems,
          edit: false,
          remove: false,
        },
        draw: false,
      });
      map.addControl(drawControl);

      map.on((L as any).Draw.Event.CREATED, (e: any) => {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        console.log(layer);
        this.circle = layer;
      });
    });
  },
  computed: {
    ...mapState("farm", ["modal"]),
    ...mapState("auth", ["local"]),
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    center() {
      if (this.local.lenght < 2) return [-19.7483, -47.9169];
      return this.local;
    },
    types() {
      return getTypes();
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    loadingItems() {
      return status === "loadingItems";
    },
    Ufs() {
      const ufs = Object.keys(getUFs());
      ufs.splice(0, 1);
      return ufs;
    },
    cmpModal: {
      get() {
        return this.modal === "NEW";
      },
      set(value) {
        if (!value) this.$store.dispatch("farm/CHANGE", { modal: "" });
      },
    },
  },
  data: () => ({
    name: "",
    cep: "",
    address: "",
    district: "",
    city: "",
    state: "",
    nirf: "",
    loadcep: false,
    drawControl: "draw",
    circle: {},
  }),
  methods: {
    novoCircle() {
      if (this.drawControl === "draw") {
        new (L as any).Draw.Circle((this.$refs.map as any).mapObject).enable();
        this.drawControl = "remove";
      } else {
        (this.$refs.map as any).mapObject.removeLayer(this.circle);
        // new (L as any).EditToolbar.Delete((this.$refs.map as any).mapObject, {
        //   featureGroup: drawnItems,
        // }).removeAllLayers();
        this.drawControl = "draw";
      }
    },
    closeModal() {
      this.$router.push({ name: "dashboard" });
    },
    createFarm() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
    },
    searchCEP() {
      if (!this.cep) return;
      this.loadcep = true;
      http
        .get("https://ws.apicep.com/cep/" + removerMask(this.cep) + ".json")
        .then((res) => {
          this.address = res.data.address;
          this.district = res.data.district;
          this.city = res.data.city;
          this.state = res.data.state;
        })
        .catch((err) => {
          this.$toast.error("Ocorreu um erro ao buscar o CEP");
        })
        .finally(() => {
          this.loadcep = false;
        });
      console.log(this.cep);
    },
  },
});
</script>
