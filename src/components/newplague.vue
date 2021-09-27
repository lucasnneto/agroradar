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
              :items="lista"
              v-model="type"
              :rules="[rules.required]"
              outlined
              label="Tipo de praga"
            ></v-select>
            <v-text-field
              outlined
              label="Nome da praga"
              v-if="type === 'OUTRO'"
              v-uppercase
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
              >
                <img height="150" width="190" :src="image" v-if="image" />
              </div>
              <v-btn
                color="primary darken-1"
                @click="newImage"
                min-width="180"
                x-large
                >Enviar Foto</v-btn
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
    ...mapState("plague", {
      modal: "modal",
      statusPlague: "status",
      lista: "lista",
    }),
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
    image: [] as any,
    file: {} as any,
  }),
  methods: {
    newFarm() {
      this.$router.push({ name: "farm" });
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
    closeModal() {
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
    newImage() {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = (input.files as any)[0];
        if (file.size >= 5000000) {
          this.$toast.error("Utilize uma imagem de no máximo 5Mb");
          return;
        }
        this.file = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.image = reader.result;
        };
      };
      input.click();
    },
    createPlague() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      var semAcento = this.otherType
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
      const data = new FormData();
      data.append("name", this.type === "OUTRO" ? semAcento : this.type);
      data.append("farmId", this.farm);
      if (this.image) {
        data.append("images", this.file);
        data.append("photo", "sim");
      }

      // const payload = {
      //   name: this.type === "OUTRO" ? semAcento : this.type,
      //   farmId: this.farm,
      //   images: this.image ? this.file : undefined,
      //   photo: this.image ? "sim" : undefined,
      // };
      console.log(data);
      this.$store.dispatch("plague/NEW_PLAGUE", data);
    },
  },
});
</script>
