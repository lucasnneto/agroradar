<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <div class="d-flex mb-6">
      <v-btn v-if="isMobile" icon @click="closeModal" class="mr-2">
        <img height="20" src="@/assets/close-green.svg" />
      </v-btn>
      <h1>Nova Conta</h1>
    </div>
    <div class="fill-height d-flex flex-column justify-center">
      <div>
        <v-text-field
          :class="isMobile ? 'mb-0' : 'mb-4'"
          outlined
          label="Nome"
        ></v-text-field>
        <v-text-field
          :class="isMobile ? 'mb-0' : 'mb-4'"
          outlined
          label="CPF"
        ></v-text-field>
        <v-text-field
          :class="isMobile ? 'mb-0' : 'mb-4'"
          outlined
          label="E-mail"
        ></v-text-field>
        <v-text-field
          :class="isMobile ? 'mb-4' : 'mb-12'"
          outlined
          label="Senha"
        ></v-text-field>
        <v-btn block height="52" class="mb-4" color="primary">
          Criar conta
        </v-btn>
        <div class="d-flex justify-center">
          <v-btn fab color="black" outlined @click="login">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    login() {
      this.$emit("change-mode", "in");
    },
    closeModal() {
      this.$router.push({ name: "home" });
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
});
</script>
<style scoped>
.card {
  width: 420px;
  border-radius: 35px 0px 0px 35px;
}
@media (max-width: 700px) {
  .card {
    width: 100vw;
    border-radius: 0;
  }
}
@media (min-width: 1350px) {
  .card {
    width: 500px;
  }
}
.mb-100 {
  margin-bottom: 100px !important;
}
</style>
