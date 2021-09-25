<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <div class="d-flex">
      <v-btn
        v-if="$vuetify.breakpoint.width <= 700"
        icon
        @click="closeModal"
        class="mr-2"
      >
        <img height="20" src="@/assets/close-green.svg" />
      </v-btn>
      <h1>Entrar</h1>
    </div>
    <div class="fill-height d-flex flex-column justify-center">
      <div>
        <v-text-field class="mb-6" outlined label="E-mail"></v-text-field>
        <v-text-field class="mb-100" outlined label="Senha"></v-text-field>
        <v-btn block height="52" class="mb-8" color="primary">
          Entrar
        </v-btn>
        <v-btn block height="52" text color="primary" @click="create">
          Criar conta
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    create() {
      this.$emit("change-mode", "up");
    },
    closeModal() {
      this.$router.push({ name: "home" });
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
