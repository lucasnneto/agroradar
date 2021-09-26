<template>
  <div>
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
        <h4 :class="{ 'error--text': invalidade }">
          {{ lat }}
        </h4>
        <h3 :class="{ 'error--text': invalidade }">LAT</h3>
      </div>
      <div>
        <h4 :class="{ 'error--text': invalidade }">
          {{ lng }}
        </h4>
        <h3 :class="{ 'error--text': invalidade }">LNG</h3>
      </div>
      <div>
        <h4 :class="{ 'error--text': invalidade }">
          {{ raio }}
        </h4>
        <h3 :class="{ 'error--text': invalidade }">RAIO</h3>
      </div>
    </div>
    <div class="d-flex justify-center">
      <v-btn
        :disabled="inDraw"
        min-width="150"
        height="50"
        color="primary darken-1"
        @click="novoCircle"
        >{{ drawControl === "draw" ? "NOVA REGIÃO" : "APAGAR MARCAÇÃO" }}</v-btn
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import L from "leaflet";
import "leaflet-draw";
import { mapState } from "vuex";
export default Vue.extend({
  props: ["value", "invalidade"],
  mounted() {
    this.$nextTick(() => {
      const map = (this.$refs.map as any).mapObject;
      var drawnItems = new L.FeatureGroup();
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
        console.log("aaa");
        var layer = e.layer;
        drawnItems.addLayer(layer);
        this.circle = layer;
        this.lat = layer._latlng.lat;
        this.lng = layer._latlng.lng;
        this.raio = layer._mRadius.toFixed(3);

        this.$emit("input", {
          radius: layer._mRadius,
          lat: layer._latlng.lat,
          lng: layer._latlng.lng,
        });
        this.drawControl = "remove";
        this.inDraw = false;
        this.$emit("in-draw", false);
      });
      map.on("draw:drawstop", (e: any) => {
        this.inDraw = false;

        this.$emit("in-draw", false);
      });
    });
  },
  computed: {
    ...mapState("auth", ["local"]),
    url() {
      return process.env.VUE_APP_MAP_URL;
    },
    center() {
      if (this.local.lenght < 2) return [-19.7483, -47.9169];
      return this.local;
    },
  },
  data: () => ({
    circle: {},
    drawControl: "draw",
    inDraw: false,
    lat: "-",
    lng: "-",
    raio: "-",
  }),
  methods: {
    novoCircle() {
      if (this.drawControl === "draw") {
        this.$toast.open({
          message:
            "Agora no mapa, selecione o ponto inicial e mantenha o botão esquerdo do mouse pressionado e empurre para definir a área da fazenda",
          type: "info",
          duration: 30000,
        });
        new (L as any).Draw.Circle((this.$refs.map as any).mapObject).enable();
        this.$emit("in-draw", true);
        this.inDraw = true;
      } else {
        (this.$refs.map as any).mapObject.removeLayer(this.circle);
        this.circle = {};
        this.lat = "-";
        this.lng = "-";
        this.raio = "-";
        this.$emit("input", {});
        this.drawControl = "draw";
      }
    },
  },
});
</script>
