<template>
  <v-dialog
    v-model="cmpModal"
    persistent
    max-width="500px"
    :retain-focus="false"
  >
    <v-card class="pa-5">
      <div class="d-flex">
        <v-btn icon color="primary" class="mr-2" @click="closeModal">
          <v-icon x-large>mdi-close</v-icon>
        </v-btn>
        <h1>Novo caso</h1>
      </div>
      <v-form ref="form">
        <v-row class="mt-6">
          <v-col cols="12">
            <h3 class="mb-3">Sobre a praga</h3>
            <v-select
              :items="types"
              v-model="type"
              :rules="[rules.required]"
              outlined
              label="Tipo de praga"
            ></v-select>
            <v-text-field
              outlined
              label="Nome da praga"
              v-if="type === 'Outro'"
              :rules="[rules.required]"
              v-model="otherType"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <h3 class="mb-3">Endereço</h3>
            <v-select
              :items="items"
              :loading="loadingItems"
              v-model="farm"
              item-value="_id"
              :item-text="(el) => el.name + ' - ' + el.nirf"
              :rules="[rules.required]"
              outlined
              label="Selecione a fazenda"
            ></v-select>
            <div class="d-flex justify-center">
              <v-btn color="primary darken-1" @click="newFarm" x-large
                >Nova fazenda</v-btn
              >
            </div>
          </v-col>
          <v-col cols="12">
            <h3 class="mb-3">
              Foto da situação
              <span class="font-weight-regular">(Opcional)</span>
            </h3>
            <div
              class="d-flex align-center"
              :class="{ 'flex-column-reverse': isMobile }"
            >
              <div
                style="height:150px; width:190px"
                class="grey"
                :class="isMobile ? 'mt-10' : 'mr-10'"
              ></div>
              <v-btn color="primary darken-1" disabled min-width="180" x-large
                >Tirar foto</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-form>
      <div class="d-flex justify-center">
        <v-btn
          x-large
          class="mt-5"
          min-width="180"
          color="primary"
          :loading="statusPlague === 'loading'"
          @click="createPlague"
          >Salvar</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { getTypes } from "@/mixins/utils";
import rules from "@/mixins/rules";
import { mapState } from "vuex";
export default Vue.extend({
  mixins: [rules],
  computed: {
    ...mapState("farm", ["items", "status"]),
    ...mapState("plague", { modal: "modal", statusPlague: "status" }),
    types() {
      return getTypes();
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    loadingItems() {
      return status === "loadingItems";
    },
    cmpModal: {
      get() {
        return this.modal === "NEW";
      },
      set(value) {
        if (!value) this.$store.dispatch("plague/CHANGE", { modal: "" });
      },
    },
  },
  created() {
    const userId = this.$store.getters["auth/userId"];
    this.$store.dispatch("farm/GET_LIST", userId);
  },
  data: () => ({
    type: "",
    farm: "",
    otherType: "",
  }),
  methods: {
    newFarm() {
      this.$router.push({ name: "farm" });
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
    closeModal() {
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
    createPlague() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      const payload = {
        name: this.type === "Outro" ? this.otherType : this.type,
        farmId: this.farm,
      };

      this.$store.dispatch("plague/NEW_PLAGUE", payload);
    },
  },
});
</script>
