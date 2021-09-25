<template>
  <v-overlay :value="cmpModal">
    <v-dialog v-model="cmpModal" persistent max-width="1000px">
      <v-card class="pa-5">
        <div class="d-flex">
          <v-btn icon color="primary" class="mr-2" @click="closeModal">
            <v-icon x-large>mdi-close</v-icon>
          </v-btn>
          <h1>Nova fazenda</h1>
        </div>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>
<script lang="ts">
import Vue from "vue";
import { getTypes } from "@/mixins/utils";
import rules from "@/mixins/rules";
import { mapState } from "vuex";
export default Vue.extend({
  mixins: [rules],
  computed: {
    ...mapState("farm", ["items", "status", "modal"]),
    types() {
      return getTypes();
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    loadingItems() {
      return status === "loadingItems";
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
  created() {
    this.$store.dispatch(
      "farm/GET_LIST",
      "9ac521ac-0d9e-4f6a-8010-d26b27e72cfa"
    );
  },
  data: () => ({
    type: "",
    farm: "",
    otherType: "",
  }),
  methods: {
    closeModal() {
      this.$store.dispatch("farm/CHANGE", { modal: "" });
    },
    createPlague() {
      if (
        !(this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        return;
      }
      const payload = {
        name: this.type === "Outro" ? this.otherType : this.type,
        farmId: this.farm,
      };

      this.$store.dispatch("plague/NEW_PLAGUE", payload);
    },
  },
});
</script>
