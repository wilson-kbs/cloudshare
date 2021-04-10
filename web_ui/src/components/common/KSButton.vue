<template>
  <div>
    <button class="ks-button" :disabled="disable">
      <slot>button</slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  props: {
    disable: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.ks-button {
  width: 100%;
  padding: 1rem 2rem;
  color: var(--color-primary-text);
  text-align: center;
  border: 0.2rem solid var(--color-primary);
  border-radius: 5rem;
  background-color: var(--color-primary);
  font-weight: bold;
  font-size: 1.8rem;
  outline: none;
  opacity: 0.5;
  transition: all 0.1s linear;
  margin: auto;
  cursor: not-allowed;

  &:not([disabled]) {
    opacity: 1;
    cursor: pointer;
    &:hover {
      color: var(--color-primary);
      background-color: transparent;
    }
    &:focus {
      box-shadow: 0 0 5px var(--color-primary);
    }
  }
}
</style>