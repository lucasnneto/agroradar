<template>
  <v-flex
    class="ma-10 d-flex flex-column justify-space-between"
    style="height:90%"
  >
    <div
      class="d-flex justify-space-between align-center mb-4"
      :class="isMobile ? 'flex-column' : ''"
    >
      <h2 v-if="isMobile">Bem vindo, {{ name.split(" ")[0] }}</h2>
      <h1 v-else>Bem vindo, {{ name.split(" ")[0] }}</h1>
      <div class="d-flex align-center" :class="isMobile ? 'mt-3' : ''">
        <v-btn
          icon
          color="primary"
          @click="openAlert"
          :loading="status === 'loading'"
          class="mr-4"
        >
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-btn fab color="primary" @click="newPlague">
          <v-icon x-large>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <v-select
      :items="ufs"
      v-model="state"
      outlined
      label="Estado"
      v-if="isMobile"
    ></v-select>
    <div class=" d-flex flex-column justify-space-between mt-10">
      <v-row class="mt-5">
        <v-col :cols="isMobile ? '12' : false">
          <div class="d-flex flex-column align-center">
            <h3 class="mb-3 text-center">TOTAL DE PRAGAS</h3>
            <h1 class="mb-6">{{ plagueData.totalPlague }}</h1>
            <img class="mb-10" src="@/assets/leaf.svg" height="47" />
          </div>
        </v-col>
        <v-col :cols="isMobile ? '12' : false">
          <div class="d-flex flex-column align-center">
            <h3 class="mb-3 text-center">Relação de tipos por total</h3>

            <apexchart
              width="250px"
              type="donut"
              :options="optionsPie"
              :series="seriesPie"
            />
          </div>
        </v-col>
        <v-col :cols="isMobile ? '12' : false">
          <div class="d-flex flex-column align-center">
            <h3 class="mb-3">Casos nos últimos dias</h3>
            <apexchart
              width="300px"
              type="area"
              :options="optionsArea"
              :series="seriesArea"
            ></apexchart>
          </div>
        </v-col>
        <v-col :cols="isMobile ? '12' : false">
          <div class="d-flex flex-column align-center">
            <h3 class="mb-3 text-center">TIPOS DE PRAGAS</h3>
            <h1 class="mb-6">{{ plagueData.plagueType }}</h1>
            <img class="mb-10" src="@/assets/type.svg" />
          </div>
        </v-col>
      </v-row>

      <v-divider class="mb-5"></v-divider>
      <v-row>
        <v-col cols="12">
          <h1 class="mb-7 text-center">Mapa de Pragas</h1>
        </v-col>

        <v-col :cols="isMobile ? '12' : false">
          <h4 class="mb-4">1º Selecione os tipos de pragas</h4>
          <div style="max-height:200px; overflow:auto">
            <v-chip
              class="ma-2"
              color="primary"
              label
              v-for="type in lista"
              :outlined="!plagues.includes(type)"
              :key="type"
              @click="plagueList(type)"
            >
              {{ type }}
            </v-chip>
          </div>
        </v-col>
        <v-col :cols="isMobile ? '12' : false">
          <h4 class="mb-4">2º Selecione o intervalo</h4>

          <datapicker v-model="datainicial" class="mb-1" label="Data Inicial" />
          <datapicker v-model="datafinal" class="mb-1" label="Data Final" />
        </v-col>

        <v-col :cols="isMobile ? '12' : false" style="min-height:230px">
          <div class="d-flex justify-center align-center relative fill-height">
            <img
              class="absolute"
              style="height:100%;width: 100%;"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/World_location_map.svg/800px-World_location_map.svg.png"
            />
            <v-overlay
              color="primary darken-1"
              class="d-flex justify-center align-center"
              opacity="0.3"
              :dark="false"
              absolute
            >
              <v-btn
                color="primary darken-1"
                @click="filterMap"
                :loading="status === 'loadingMap'"
              >
                Ver mapa
              </v-btn>
            </v-overlay>
          </div>
        </v-col>
      </v-row>
    </div>
    <div
      class="d-flex mt-5"
      :class="isMobile ? 'justify-center' : 'justify-end'"
    >
      <v-btn @click="logout" min-width="150px" outlined large color="primary"
        >Sair</v-btn
      >
    </div>

    <v-navigation-drawer
      v-if="!isMobile && status !== 'loadingData'"
      permanent
      app
    >
      <h3 class="text-center mb-4 mt-10">Estados Referência</h3>
      <v-flex class="d-flex overflow-y-auto">
        <v-flex class="d-flex">
          <v-timeline dense>
            <v-timeline-item
              right
              small
              :color="state === uf ? 'primary' : 'white'"
              v-for="uf in ufs"
              :key="uf"
              class="pr-3"
              :class="{ 'font-weight-bold primary--text': state === uf }"
            >
              <p class="cursor-pointer" @click="changeUf(uf)">
                {{ uf }}
              </p>
            </v-timeline-item>
          </v-timeline>
        </v-flex>
      </v-flex>
    </v-navigation-drawer>
    <newplague v-if="modalPlague === 'NEW'" />
    <filterMap v-if="modalPlague === 'FILTER'" />
    <alertModal v-if="modalPlague === 'ALERT'" />
    <v-overlay
      v-if="status === 'loadingData'"
      color="grey"
      class="d-flex justify-center align-center"
      opacity="0.5"
      :dark="false"
      absolute
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="70"
      ></v-progress-circular>
    </v-overlay>
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";
import { getUFs, getTypes } from "@/mixins/utils";
import datapicker from "@/components/datapicker.vue";
import newplague from "@/components/newplague.vue";
import alertModal from "@/components/alert.vue";
import filterMap from "@/components/maps/filter.vue";
import { mapState } from "vuex";
import { formattedDate } from "@/mixins/utils";
export default Vue.extend({
  components: {
    datapicker,
    newplague,
    filterMap,
    alertModal,
  },
  computed: {
    ...mapState("plague", {
      modalPlague: "modal",
      status: "status",
      plagueData: "data",
      lista: "lista",
    }),
    ...mapState("farm", { modalFarm: "modal" }),
    ...mapState("auth", ["name"]),
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    ufs() {
      return Object.keys(getUFs());
    },
    types() {
      return getTypes();
    },
    seriesPie() {
      let data: any = [];
      if (this.plagueData?.percentList)
        data = this.plagueData.percentList.map((el: any) =>
          Number(Number(el.percent * 100).toFixed(2))
        );
      return data;
    },
    optionsPie() {
      let data: any = [];
      if (this.plagueData?.percentList)
        data = this.plagueData.percentList.map((el: any) => el.type);
      return {
        labels: data,
        colors: ["#04842C", "#3DBC65", "#A2CFB0"],
        legend: {
          show: false,
        },
      };
    },
    optionsArea() {
      let data: any = [];
      if (this.plagueData?.caseDays)
        data = this.plagueData.caseDays.map((el: any) => {
          const newData = formattedDate(el.date);
          if (newData.length === 10) {
            const dt = newData.split("/");
            return `${dt[0]}/${dt[1]}`;
          }
          return "?";
        });
      return {
        colors: ["#04842C"],
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: data,
        },
      };
    },
    seriesArea() {
      let data: any = [];
      if (this.plagueData?.caseDays)
        data = this.plagueData.caseDays.map((el: any) => el.qtd);
      return [
        {
          name: "Caso(s) no dia",
          data: data,
        },
      ];
    },
  },
  created() {
    this.$store.dispatch("plague/GET_LISTA");
    this.$store.dispatch("plague/GET_DATA");
  },
  data: () => ({
    state: "BRASIL",
    datainicial: "",
    datafinal: "",
    plagues: [] as Array<string>,
  }),
  methods: {
    changeUf(uf: string) {
      if (uf === this.state) return;
      this.state = uf;
      if (uf === "BRASIL") this.$store.dispatch("plague/GET_DATA");
      else this.$store.dispatch("plague/GET_DATA_STATE", uf);
    },
    plagueList(plague: string) {
      const index = this.plagues.findIndex((el) => el === plague);
      if (index === -1) this.plagues.push(plague);
      else this.plagues.splice(index, 1);
    },
    newPlague() {
      this.$store.dispatch("plague/CHANGE", { modal: "NEW" });
    },
    openAlert() {
      this.$store.dispatch(
        "plague/GET_NOTIFICATION",
        this.$store.getters["auth/userId"]
      );
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    filterMap() {
      if (this.plagues.length === 0) {
        this.$toast.info("Selecione no mínimo uma praga.");
        return;
      }
      const payload = {
        state: this.state,
        payload: {
          plagues: this.plagues,
          dateBegin: this.datainicial || undefined,
          dateEnd: this.datainicial || undefined,
        },
      };
      this.$store.dispatch("plague/GET_PLAGUE_FILTER", payload);
    },
  },
});
</script>
<style scoped>
::v-deep .v-timeline-item__dot {
  background: var(--v-primary-base) !important;
}
</style>
