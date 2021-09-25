<template>
  <v-flex class="ma-8">
    <div class="d-flex">
      <v-btn icon color="primary" class="mr-2">
        <v-icon x-large>mdi-close</v-icon>
      </v-btn>
      <h1>Novo caso</h1>
    </div>
    <v-row class="mt-6">
      <v-col :cols="isMobile ? '12' : '6'">
        <h3 class="mb-3">Sobre a praga</h3>
        <v-select
          :items="types"
          v-model="type"
          outlined
          label="Tipo de praga"
        ></v-select>
        <v-text-field
          outlined
          label="Nome da praga"
          v-if="type === 'Outro'"
          v-model="otherType"
        ></v-text-field>
      </v-col>
      <v-col :cols="isMobile ? '12' : '6'">
        <h3 class="mb-3">Endereço</h3>
        <v-select
          :items="[]"
          v-model="farm"
          item-value="_id"
          outlined
          label="Tipo de praga"
        ></v-select>
        <v-btn color="primary darken-1" x-large>Nova fazenda</v-btn>
      </v-col>
      <v-col :cols="isMobile ? '12' : '6'">
        <h3 class="mb-3">
          Foto da situação <span class="font-weight-regular">(Opcional)</span>
        </h3>
        <div class="d-flex align-center">
          <div style="height:150px; width:190px" class="grey mr-10"></div>
          <v-btn color="primary darken-1" min-width="180" x-large
            >Tirar foto</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn x-large class="mt-5" min-width="180" color="primary">Salvar</v-btn>
    </div>
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";
import { getTypes } from "@/mixins/utils";
export default Vue.extend({
  computed: {
    types() {
      return getTypes();
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
  data: () => ({
    type: "",
    otherType: "",
  }),
});
</script>
