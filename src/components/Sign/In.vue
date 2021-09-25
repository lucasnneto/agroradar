<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <div class="d-flex">
      <v-btn
        v-if="$vuetify.breakpoint.width <= 700"
        icon
        @click="closeModal"
        class="mr-4"
      >
        <img height="20" src="@/assets/close-green.svg" />
      </v-btn>
      <h1>Entrar</h1>
    </div>
    <div class="fill-height d-flex flex-column justify-center">
      <div>
        <v-text-field
          class="mb-6"
          v-model="email"
          outlined
          :rules="[rules.required, rules.email]"
          label="E-mail"
        ></v-text-field>
        <v-text-field
          class="mb-100"
          v-model="senha"
          :type="typePass"
          @click:append="
            typePass = typePass === 'password' ? 'text' : 'password'
          "
          :append-icon="
            typePass === 'password' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="[rules.required]"
          outlined
          label="Senha"
        ></v-text-field>
        <v-btn block height="52" class="mb-8" color="primary" @click="entrar">
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
import rules from "@/mixins/rules";
export default Vue.extend({
  mixins: [rules],
  data: () => ({
    email: "",
    senha: "",
    typePass: "password",
  }),
  methods: {
    entrar() {
      const payload = {
        email: this.email,
        password: this.senha,
      };
      this.$store.dispatch("auth/LOGIN", payload);
    },
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
  margin-bottom: 80px !important;
}
</style>
