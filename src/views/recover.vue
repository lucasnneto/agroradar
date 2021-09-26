<template>
  <v-flex class="ma-10 d-flex flex-column justify-start" style="height:90%">
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 v-if="isMobile">Recuperar a Senha</h2>
      <h1 v-else>Recuperar a senha</h1>
    </div>
    <div class="fill-height d-flex align-center justify-center">
      <v-form ref="form" style="width:400px">
        <v-text-field
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
        <v-text-field
          v-model="confirm"
          :type="typePass"
          @click:append="
            typePass = typePass === 'password' ? 'text' : 'password'
          "
          :append-icon="
            typePass === 'password' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="[rules.required, sameof]"
          outlined
          label="Repetir senha"
        ></v-text-field>
        <div class="d-flex justify-center">
          <v-btn
            height="50"
            x-large
            width="250"
            color="primary"
            @click="entrar"
            :loading="status === 'loading'"
            >Trocar senha</v-btn
          >
        </div>
      </v-form>
    </div>
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";
import rules from "@/mixins/rules";
import { mapState } from "vuex";
export default Vue.extend({
  mixins: [rules],
  data: () => ({
    typePass: "password",
    senha: "",
    confirm: "",
  }),
  computed: {
    ...mapState("auth", ["status"]),
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
  },
  methods: {
    sameof() {
      return this.senha === this.confirm || "As senhas não conferem!";
    },
    entrar() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      const token = this.$route.params.id;
      const payload = {
        token: token,
        payload: {
          password: this.senha,
        },
      };
      this.$store.dispatch("auth/NEW_PAS", payload);
    },
  },
});
</script>
