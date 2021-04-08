<template>
  <div>
    <div class="input-password-wrapper">
      <input
        :type="passwordVisible ? 'text' : 'password'"
        :class="{ visible: passwordVisible }"
        :style="{ height }"
        ref="input"
        :placeholder="placeHolder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('keyup:enter')"
      />
      <span
        class="toggle-view-password"
        @click="toggleViewPassword"
        @mousedown="onMousedown"
        @mouseup="onMouseup"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["update:modelValue", "keyup:enter"],
  setup() {
    const input = ref<HTMLInputElement | null>(null);
    return {
      input,
    };
  },
  data() {
    return {
      passwordVisible: false,
    };
  },
  props: {
    autoFocus: {
      type: Boolean,
      default: false,
    },
    modelValue: String,
    placeHolder: {
      default: "Mot de passe",
    },
    height: {
      type: String,
      default: "32px",
    },
  },
  methods: {
    focus() {
      (this.$refs["input"] as HTMLInputElement).focus();
    },
    toggleViewPassword() {
      this.passwordVisible = !this.passwordVisible;
    },
    onMousedown: (e: Event) => {
      e.preventDefault();
    },
    onMouseup: (e: Event) => {
      e.preventDefault();
    },
  },
  mounted() {
    if (this.autoFocus) {
      this.focus();
    }
  },
});
</script>

<style lang="scss">
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";

.input-password-wrapper {
  position: relative;
  display: inline-block;
  height: fit-content;
  width: 100%;

  & input {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 5rem;
    color: var(--color-main-text);
    padding: 2rem 1rem;
    padding-right: 4rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-main-background);
    border-radius: 1rem;
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

    &:focus {
      // box-shadow: 0 0 7px #0056b1;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    &:hover {
      border: 1px solid #40a9ff;
    }
  }

  &:hover > input {
    border-color: #40a9ff;
  }

  & .toggle-view-password {
    @extend %fa-icon;
    @extend .fas;

    position: absolute;
    right: 1.5rem;
    top: 50%;
    font-size: 12px;
    z-index: 2;
    transform: translateY(-50%);
    opacity: 0.3;
    transition: opacity 0.1s linear;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }

  & input.visible + .toggle-view-password:after {
    content: fa-content($fa-var-eye);
  }
  & input + .toggle-view-password:after {
    content: fa-content($fa-var-eye-slash);
  }
}
</style>
