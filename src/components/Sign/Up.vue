<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <div class="d-flex mb-6" v-if="!isMobile">
      <h1>Nova Conta</h1>
    </div>
    <div class="fill-height d-flex flex-column justify-center">
      <div class="d-flex mb-6" v-if="isMobile">
        <v-btn v-if="isMobile" icon @click="closeModal" class="mr-2">
          <img height="20" src="@/assets/close-green.svg" />
        </v-btn>
        <h1>Nova Conta</h1>
      </div>
      <v-form ref="form">
        <div>
          <v-text-field
            :class="isMobile ? 'mb-0' : 'mb-4'"
            :rules="[rules.required]"
            v-model="name"
            outlined
            label="Nome"
          ></v-text-field>
          <v-text-field
            :class="isMobile ? 'mb-0' : 'mb-4'"
            :rules="[rules.required, rules.cpf]"
            v-model="taxId"
            v-mask="'###.###.###-##'"
            outlined
            label="CPF"
          ></v-text-field>
          <v-text-field
            :class="isMobile ? 'mb-0' : 'mb-4'"
            :rules="[rules.required, rules.email]"
            v-model="email"
            outlined
            label="E-mail"
            autocomplete="new-username"
          ></v-text-field>
          <v-text-field
            :class="isMobile ? 'mb-4' : 'mb-12'"
            v-model="senha"
            :type="typePass"
            autocomplete="new-password"
            @click:append="
              typePass = typePass === 'password' ? 'text' : 'password'
            "
            :append-icon="
              typePass === 'password'
                ? 'mdi-eye-outline'
                : 'mdi-eye-off-outline'
            "
            :rules="[rules.required]"
            outlined
            label="Senha"
          ></v-text-field>
          <v-btn
            block
            height="52"
            class="mb-4"
            color="primary"
            @click="cadastrar"
            :loading="loading"
          >
            Criar conta
          </v-btn>
          <div class="d-flex justify-center">
            <v-btn
              fab
              color="black"
              outlined
              @click="login"
              :disabled="loading"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import rules from "@/mixins/rules";
import { removerMask } from "@/mixins/utils";
import { mapState } from "vuex";
export default Vue.extend({
  mixins: [rules],
  data: () => ({
    email: "",
    senha: "",
    taxId: "",
    name: "",
    typePass: "password",
  }),
  methods: {
    login() {
      this.$store.dispatch("auth/CHANGE", {
        screen: "in",
      });
    },
    closeModal() {
      this.$store.dispatch("auth/CHANGE", {
        screen: "in",
      });
      this.$router.push({ name: "home" });
    },
    cadastrar() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      const payload = {
        email: this.email,
        password: this.senha,
        taxId: removerMask(this.taxId),
        name: this.name,
      };
      this.$store.dispatch("auth/REGISTRAR", payload);
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    ...mapState("auth", ["status"]),
    loading() {
      return this.status === "loading";
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
