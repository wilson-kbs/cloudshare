<template>
  <div class="expire-option-wrapper">
    <span class="expire-option-title">Suppression après:</span>
    <fieldset id="expire-option" class="not-selected">
      <div
        class="expire-option-item"
        v-for="item in expirationListOption"
        :key="item.id"
      >
        <input
          type="radio"
          :id="'expire-option-item-' + item.id"
          :value="item.id"
          v-model="expireValue"
          name="expire-option"
        />
        <label :for="'expire-option-item-' + item.id" :title="item.long">
          {{ item.short }}
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

export default defineComponent({
  setup() {
    return {};
  },
  data() {
    return {
      expirationListOption: [
        { id: 0, short: "10 Min", long: "10 Minutes" },
        { id: 1, short: "1H", long: "1 Heure" },
        { id: 2, short: "1J", long: "1 Jour" },
        { id: 3, short: "3J", long: "3 Jours" },
      ],
    };
  },
  computed: {
    expireValue: {
      get() {
        return this.$store.state.upload.expiration;
      },
      set(value) {
        this.$store.commit(UploadMutationTypes.UPDATE_EXPIRATION, value);
      },
    },
  },
});
</script>

<style lang="scss">
.expire-option-wrapper {
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-self: center;
  width: 100%;
  box-sizing: border-box;
}
.expire-option--title {
  font-size: 1.4rem;
  padding-bottom: 1rem;
  box-sizing: border-box;
}

#expire-option {
  display: flex;
  align-self: center;
  width: 90%;
  justify-content: space-around;
  border: 0.1rem solid var(--color-border);
  min-width: 22rem;
  max-width: 29rem;
  margin-top: 1rem;
  border-radius: 5rem;
  box-sizing: border-box;
  overflow: hidden;
}

.expire-option-item {
  display: inline-block;
  width: 100%;
  position: relative;

  & input {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    opacity: 0;
  }

  & label {
    position: relative;
    padding: 0.7rem 0.1rem;
    display: block;
    width: 100%;
    border-radius: 5rem;
    color: var(--color-main-text);
    font-size: 1.4rem;
    font-weight: 600;
    box-sizing: border-box;
    opacity: 0.4;
    cursor: pointer;
    text-align: center;
    transition: all 0.1s linear;
    &:active {
      background-color: transparent;
    }
  }

  & input:hover + label,
  & input:checked + label {
    opacity: 1;
  }

  & input:checked + label {
    color: var(--color-primary-text);
    background-color: var(--color-primary);
  }
}
</style>