<template>
  <button class="button-text" @click="$event.preventDefault()">
    <span class="button-text-value">{{ value }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  props: {
    value: String,
  },
});
</script>

<style scoped>
</style>