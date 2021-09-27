<template>
  <v-dialog
    v-model="cmpModal"
    persistent
    max-width="470px"
    transition="dialog-transition"
  >
    <v-card class="pa-5">
      <div class="d-flex mb-3">
        <v-btn icon color="primary" class="mr-2" @click="closeModal">
          <v-icon x-large>mdi-close</v-icon>
        </v-btn>
        <h1>Notificações</h1>
      </div>
      <div style="max-height:350px" class="overflow-auto">
        <template v-for="(not, index) in notification">
          <v-list-item two-line :key="not._id">
            <v-list-item-content>
              <v-list-item-title>{{ not.message }}</v-list-item-title>
              <v-list-item-subtitle>{{
                formattedDate(not.createdAt)
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="dismis(not._id)" :loading="not.load">
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider
            :key="index"
            v-if="index < notification.length - 1"
            class="my-1"
          ></v-divider>
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { formattedDate } from "@/mixins/utils";
export default Vue.extend({
  computed: {
    ...mapState("plague", ["modal", "item", "notification"]),
    cmpModal: {
      get() {
        return this.modal === "ALERT";
      },
      set(value) {
        if (!value) this.$store.dispatch("plague/CHANGE", { modal: "" });
      },
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch("plague/CHANGE", { modal: "" });
    },
    dismis(id: string) {
      this.$store.dispatch("plague/REMOVENOT", id);
    },
    formattedDate,
  },
  data: () => ({}),
});
</script>
