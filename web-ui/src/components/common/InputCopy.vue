<template>
  <div class="input-copy-wrapper">
    <input
      id="copy-content"
      type="text"
      ref="input"
      readonly="readonly"
      :value="value"
      @focus="$event.target.select()"
      @keydown="$event.preventDefault()"
    />
    <popup
      v-if="copyIsSupport"
      :trigger="'click'"
      :clickToShow="true"
      :duration="1000"
    >
      <template v-slot:content>Copier!</template>
      <span class="clipboard-button" :data-clipboard-text="value"></span>
    </popup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popup from "./Popup";
import ClipboardJS from "clipboard";

export default defineComponent({
  components: { Popup },
  setup() {
    const copyIsSupport = ClipboardJS.isSupported();
    return {
      copyIsSupport,
      clipboardJS: null as ClipboardJS | null,
    };
  },
  props: {
    value: {
      type: String,
    },
  },
  mounted() {
    if (this.copyIsSupport)
      this.clipboardJS = new ClipboardJS(".clipboard-button");
  },
  beforeUnmount() {
    if (this.copyIsSupport) this.clipboardJS?.destroy();
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/regular.scss";

.input-copy-wrapper {
  position: relative;
  display: inline-block;
  height: fit-content;
  overflow: hidden;
  width: 100%;
  border: 0.1rem solid var(--color-border);
  border-radius: 1rem;

  & input {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 3.5rem;
    padding: 1.5rem 1rem;
    color: var(--color-main-text);
    background-color: var(--color-main-background);
    //padding-right: 4rem;
    border: none;
    width: 100%;
    max-width: 100%;
    outline: 0;
    overflow: visible;
    transition: border-color 0.1s linear;

    &::placeholder {
      color: var(--color-main-text);
      font-size: 1.6rem;
      opacity: 0.4;
    }
  }

  &:hover > input {
    border-color: #40a9ff;
  }
}

.clipboard-button {
  @extend %fa-icon;
  @extend .far;

  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 5rem;
  background-color: var(--color-border);
  display: flex;
  font-size: 2rem;

  cursor: pointer;

  &::after {
    margin: auto;
    opacity: 0.7;
    content: fa-content($fa-var-copy);
  }
  &:hover::after {
    opacity: 1;
  }
}
</style>