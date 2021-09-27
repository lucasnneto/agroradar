<template>
  <v-overlay
    :value="true"
    color="primary darken-1"
    class="d-flex justify-end"
    opacity="0.4"
    :dark="false"
  >
    <div class="d-flex fill-height align-center justify-end main-card">
      <v-btn
        elevation="2"
        v-if="$vuetify.breakpoint.width > 700"
        fab
        x-large
        class="mr-6"
        @click="closeModal"
      >
        <img src="@/assets/close-green.svg" />
      </v-btn>
      <component :is="screen" />
    </div>
  </v-overlay>
</template>

<script lang="ts">
import Vue from "vue";
import In from "./Sign/In.vue";
import Up from "./Sign/Up.vue";
import Recover from "./Sign/Recover.vue";
import { mapState } from "vuex";

export default Vue.extend({
  components: { In, Up, Recover },
  name: "Sign",
  data: () => ({}),
  computed: {
    ...mapState("auth", ["screen"]),
  },
  methods: {
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
::v-deep .v-overlay__content {
  height: 100%;
}
.main-card {
  width: 50vw;
}
@media (max-width: 700px) {
  .main-card {
    width: 100%;
  }
}
</style>
