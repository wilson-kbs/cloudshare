<template>
  <div class="options-card">
    <div class="option-header">
      <span class="options-title">Options:</span>
    </div>
    <div class="options-body">
      <ExpirationOption />
      <KSInput
        type="password"
        class="password-opt"
        v-model="password"
        :error="passwordError"
        @blur="checkPassword()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ExpirationOption from "./options/ExpirationOption.vue";

import KSInput from "@/components/common/KSInput";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

export default defineComponent({
  components: {
    ExpirationOption,
    KSInput,
  },
  setup() {
    return {};
  },
  data() {
    return {
      passwordError: false,
    };
  },
  computed: {
    password: {
      get(): string {
        return this.$store.state.upload.options.password;
      },
      set(value: string) {
        this.$store.commit(UploadMutationTypes.PASSWORD, value);
      },
    },
  },
  watch: {
    password(value: string | number) {
      console.log(value);
    },
  },
  methods: {
    checkPassword() {
      if (this.password.length == 0) return;
      const regex = new RegExp("^[-_0-9a-zA-Z]{4,32}$");
      if (regex.test(this.password)) this.passwordError = false;
      else this.passwordError = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.options-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  padding-top: 10px;

  & .password-opt {
    margin-top: 15px;
    margin-bottom: 10px;
  }
}
</style>