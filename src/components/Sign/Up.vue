<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <h1>Nova Conta</h1>
    <div class="fill-height d-flex flex-column justify-center">
      <div>
        <v-text-field class="mb-4" outlined label="Nome"></v-text-field>
        <v-text-field class="mb-4" outlined label="CPF"></v-text-field>
        <v-text-field class="mb-4" outlined label="E-mail"></v-text-field>
        <v-text-field class="mb-16" outlined label="Senha"></v-text-field>
        <v-btn block height="52" class="mb-8" color="primary">
          Criar conta
        </v-btn>
        <div class="d-flex justify-center">
          <v-btn fab large color="black" outlined @click="login">
            <img src="@/assets/close.svg" />
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
  },
});
</script>
<style scoped>
.card {
  width: 460px;
  border-radius: 35px 0px 0px 35px;
}
.mb-100 {
  margin-bottom: 100px !important;
}
</style>
