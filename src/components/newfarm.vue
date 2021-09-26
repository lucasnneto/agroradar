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
            <p>Pressione na lupa para realizar a busca automática</p>
            <v-text-field
              outlined
              label="CEP"
              :rules="[rules.required]"
              v-model="cep"
              v-mask="'##.###-###'"
              append-outer-icon="mdi-magnify"
              @click:append-outer="searchCEP"
              :loading="loadcep"
              @keyup.enter="searchCEP"
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
            <editMap
              v-model="circle"
              @in-draw="(e) => (indraw = e)"
              :invalidade="invalidLocal"
            />
          </v-col>
        </v-row>
      </v-form>
      <div class="d-flex justify-center mt-5">
        <v-btn
          min-width="150"
          height="50"
          color="primary"
          @click="createFarm"
          :disabled="indraw"
          :loading="status === 'loading'"
          >SALVAR</v-btn
        >
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
import editMap from "@/components/maps/edit.vue";

export default Vue.extend({
  mixins: [rules],
  components: {
    editMap,
  },

  computed: {
    ...mapState("farm", ["modal", "status"]),
    ...mapState("auth", ["local"]),
    types() {
      return getTypes();
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
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
    indraw: false,
    circle: {} as any,
    invalidLocal: false,
  }),
  watch: {
    indraw() {
      this.invalidLocal = false;
    },
  },
  methods: {
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
      if (Object.keys(this.circle).length === 0) {
        this.invalidLocal = true;
        return;
      }
      const userId = this.$store.getters["auth/userId"];
      const payload = {
        name: this.name,
        userId: userId,
        street: this.address,
        district: this.district,
        city: this.city,
        cep: this.cep,
        state: this.state,
        nirf: this.nirf,
        position: {
          radius: this.circle.radius,
          lat: this.circle.lat,
          long: this.circle.lng,
        },
      };
      this.$store.dispatch("farm/NEW_FARM", payload);
    },
    searchCEP() {
      if (!this.cep) return;
      this.loadcep = true;

      http
        .get("https://ws.apicep.com/cep/" + removerMask(this.cep) + ".json")
        .then((res) => {
          if (!res.data.ok) {
            this.$toast.error(res.data.message);
          } else {
            this.address = res.data.address;
            this.district = res.data.district;
            this.city = res.data.city;
            this.state = res.data.state;
          }
        })
        .catch((err) => {
          this.$toast.error("Ocorreu um erro ao buscar o CEP");
        })
        .finally(() => {
          this.loadcep = false;
        });
    },
  },
});
</script>
