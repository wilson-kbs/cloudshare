<template>
  <div class="options-card">
    <div class="option-header">
      <span class="options-title">Options:</span>
    </div>
    <div class="options-body">
      <ExpirationOption />
      <InputPassword
        class="password-option"
        v-model="password"
        :height="'5rem'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ExpirationOption from "./options/ExpirationOption.vue";

import InputPassword from "@/components/common/InputPassword.vue";
import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

export default defineComponent({
  components: {
    ExpirationOption,
    InputPassword,
  },
  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {
    password: {
      get(): string {
        return this.$store.state.upload.password;
      },
      set(value: string) {
        this.$store.commit(UploadMutationTypes.UPDATE_PASSWORD, value);
      },
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

  & .password-option {
    padding-top: 15px;
    padding-bottom: 10px;
  }
}
</style>