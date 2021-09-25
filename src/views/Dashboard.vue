<template>
  <v-container class="d-flex flex-column align-center">
    <h1>Bem vindo, João</h1>
    <div class="d-flex mt-13">
      <div>
        <h3 class="text-center mb-4">Estados <br />Referência</h3>
        <div class="timeline">
          <v-timeline dense>
            <v-timeline-item
              right
              small
              :color="state === uf ? 'primary' : 'white'"
              v-for="uf in ufs"
              :key="uf"
              class="pr-4"
              :class="{ 'font-weight-bold primary--text': state === uf }"
            >
              <p class="cursor-pointer" @click="changeUf(uf)">
                {{ uf }}
              </p>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>
      <div class="mx-10 d-flex flex-column justify-center">
        <div class="d-flex">
          <div class="d-flex flex-column align-center mx-16">
            <h3 class="mb-3 text-center">TOTAL DE PRAGAS</h3>
            <h1 class="mb-6">20.000</h1>
            <img class="mb-10" src="@/assets/leaf.svg" height="47" />
          </div>
          <v-divider vertical></v-divider>
          <div class="d-flex flex-column align-center mx-16">
            <h3 class="mb-10 text-center">Relação de tipos por total</h3>
            <img
              class="mb-10"
              src="https://img2.gratispng.com/20180328/ajq/kisspng-donuts-pie-chart-chart-5abb86a2cfe6b0.9579968515222391388516.jpg"
              height="130"
            />
          </div>
          <v-divider vertical></v-divider>
          <div class="d-flex flex-column align-center mx-16">
            <h3 class="mb-10">Casos nos últimos dias</h3>
            <img
              class="mb-10"
              src="https://help.highbond.com/helpdocs/riskbond/pt-br/Content/images/visualizer/chart_examples/standard_area_chart.png"
              height="90"
            />
          </div>
          <v-divider vertical></v-divider>
          <div class="d-flex flex-column align-center mx-16">
            <h3 class="mb-3 text-center">TIPOS DE PRAGAS</h3>
            <h1 class="mb-6">3</h1>
            <img class="mb-10" src="@/assets/type.svg" />
          </div>
        </div>
        <v-divider></v-divider>
        <div class="mt-5 mb-5 d-flex flex-column">
          <h1 class="mb-7 text-center">Mapa de Pragas</h1>
          <v-row>
            <v-col>
              <h4 class="mb-4">1º Selecione os tipos de pragas</h4>
              <v-chip
                class="ma-2"
                color="primary"
                label
                v-for="type in types"
                outlined
                :key="type"
              >
                {{ type }}
              </v-chip>
            </v-col>
            <v-col>
              <h4 class="mb-4">2º Selecione o intervalo</h4>
              <v-text-field
                label="Data Inicial"
                class="mb-1"
                outlined
                readonly
              ></v-text-field>
              <v-text-field label="Data Final" outlined readonly></v-text-field>
            </v-col>

            <v-col class="d-flex justify-center align-center relative">
              <img
                class="absolute"
                style="height:100%;width: inherit;"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/World_location_map.svg/800px-World_location_map.svg.png"
              />
              <v-overlay
                color="primary darken-1"
                class="d-flex justify-center align-center"
                opacity="0.3"
                :dark="false"
                absolute
              >
                <v-btn color="primary darken-1">
                  Ver mapa
                </v-btn>
              </v-overlay>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { getUFs, getTypes } from "@/mixins/utils";
export default Vue.extend({
  computed: {
    ufs() {
      return Object.keys(getUFs());
    },
    types() {
      return getTypes();
    },
  },
  data: () => ({
    state: "AC",
  }),
  methods: {
    changeUf(uf: string) {
      if (uf === this.state) return;
      this.state = uf;
    },
  },
});
</script>
<style scoped>
.timeline {
  max-height: 80vh; /*FIX CORRIGIR ESSA CAGADA*/
  overflow-x: auto;
}
::v-deep .v-timeline-item__dot {
  background: var(--v-primary-base) !important;
}
</style>
