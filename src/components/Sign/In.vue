<template>
  <div class="card white fill-height py-11 px-8 d-flex flex-column">
    <div class="d-flex" v-if="$vuetify.breakpoint.width > 700">
      <h1>Entrar</h1>
    </div>
    <div class="fill-height d-flex flex-column justify-center ">
      <div class="d-flex mb-10" v-if="$vuetify.breakpoint.width <= 700">
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
      <v-form ref="login">
        <div>
          <v-text-field
            class="mb-6"
            v-model="email"
            outlined
            @keyup.enter="entrar"
            :rules="[rules.required, rules.email]"
            label="E-mail"
          ></v-text-field>
          <v-text-field
            v-model="senha"
            :type="typePass"
            @keyup.enter="entrar"
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
          <div
            class="d-flex align-center mb-100"
            :class="$vuetify.breakpoint.width <= 700 ? 'flex-column' : ''"
          >
            <p>
              Esqueceu a senha?
            </p>
            <v-btn @click="recoverSenha" text color="primary"
              >Recuperar Senha</v-btn
            >
          </div>
          <v-btn
            block
            height="52"
            class="mb-8"
            color="primary"
            @click="entrar"
            :loading="loading"
          >
            Entrar
          </v-btn>
          <v-btn
            block
            height="52"
            text
            color="primary"
            @click="create"
            :disabled="loading"
          >
            Criar conta
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import rules from "@/mixins/rules";
import { mapState } from "vuex";
export default Vue.extend({
  mixins: [rules],
  data: () => ({
    email: "",
    senha: "",
    typePass: "password",
  }),
  computed: {
    ...mapState("auth", ["status"]),
    loading() {
      return this.status === "loading";
    },
  },
  methods: {
    entrar() {
      if (
        !(this.$refs.login as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      const payload = {
        email: this.email,
        password: this.senha,
      };
      this.$store.dispatch("auth/LOGIN", payload);
    },
    create() {
      this.$store.dispatch("auth/CHANGE", {
        screen: "up",
      });
    },
    recoverSenha() {
      this.$store.dispatch("auth/CHANGE", {
        screen: "recover",
      });
    },
    closeModal() {
      this.$store.dispatch("auth/CHANGE", {
        screen: "in",
      });
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
