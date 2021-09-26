<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        outlined
        readonly
        clearable
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" :max="max" scrollable color="primary">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal = false">
        Cancel
      </v-btn>
      <v-btn text color="primary" @click="$refs.dialog.save(date)">
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: () =>
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
    },
    label: String,
  },
  data() {
    return {
      max: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      date: this.value,
      modal: false,
    };
  },
  watch: {
    date(value) {
      this.$emit("input", value);
    },
  },
});
</script>
