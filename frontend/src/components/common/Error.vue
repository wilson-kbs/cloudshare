<template>
  <div class="error-page">
    <span class="errorcode">
      <span class="codetext">
        {{ errorCode }}
      </span>
    </span>
    <span class="errortext">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { ErrorCode } from "@/@types";
import { defineComponent } from "vue";

export default defineComponent({
  setup(props) {
    let errorText = "";

    switch (props.errorCode) {
      case 404:
        errorText = "Page introuvable";
        break;
      case 403:
        errorText = "Les données ne sont plus accessible";
        break;
      case 503:
        errorText =
          "Une erreur serveur est survenu. Veuillez réessayer plus tard";
        break;
    }
    return { errorText };
  },
  props: {
    errorCode: {
      type: Number as () => ErrorCode,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.error-page {
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  color: var(--color-error);
  font-weight: bold;
  & > * {
    display: inline-block;
  }
}
.errorcode {
  font-size: 10rem;
  padding: 2rem 0;
  .codetext {
  }
}
.errortext {
  font-size: 2.4rem;
}
</style>