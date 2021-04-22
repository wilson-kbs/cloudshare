<template>
  <section :class="['auth-view']">
    <div class="auth-view__wrapper">
      <div class="auth-view__content">
        <InputPassword
          class="input-assword"
          :autoFocus="true"
          v-model="password"
          @keyup:enter="getAuth"
        />
        <span class="action__send" @click="getAuth"></span>
      </div>
      <div v-visible="error" class="auth-view__error">
        <span class="errortext">Mot de passe incorrect</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import InputPassword from "@/components/common/InputPassword.vue";
import { DownloadActionTypes } from "@/store/modules/download/action-types";
import { ProcessState } from "@/_utils";

export default defineComponent({
  emits: ["success"],
  components: {
    InputPassword,
  },
  setup() {
    return {};
  },
  data() {
    return {
      password: "",
      error: false,
    };
  },
  computed: {
    authState(): ProcessState {
      return this.$store.state.download.auth.state;
    },
  },
  watch: {
    "authState.value"() {
      if (this.authState.isError) {
        this.password = "";
        this.error = true;
      }
      if (this.authState.isSuccess) this.$emit("success");
    },
  },
  methods: {
    getAuth() {
      this.$store.dispatch(DownloadActionTypes.GET_AUTH, this.password);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/styles/font-awesome/fontawesome.scss";
@import "../assets/styles/font-awesome/solid.scss";

.auth-view {
  width: 100%;
  max-width: 350px;
}

.auth-view__content {
  display: flex;
}

.input-assword {
  width: 100%;
}

.action__send {
  @extend %fa-icon;
  @extend .fas;
  align-self: center;
  height: fit-content;
  margin-left: 1.2rem;
  font-size: 2.5rem;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
  &::after {
    content: fa-content($fa-var-arrow-right);
  }
}
</style>
