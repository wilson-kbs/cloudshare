<template>
  <div
    :class="[
      'upload-card',
      { pendind: uploadState == 'PENDING' },
      { success: uploadState == 'SUCCESS' },
    ]"
  >
    <transition name="fade" mode="out-in">
      <div class="upload-card-wrapper" v-if="!complete">
        <transition name="fade">
          <div class="upload-header" v-if="!$store.getters.uploadState">
            <span class="upload-card-title">{{ title }}</span>
          </div>
        </transition>
        <div class="upload-body">
          <UploadFilesView @complete="complete = true" />
          <transition name="fade">
            <OptionsCard v-if="!uploadState" />
          </transition>
        </div>
        <transition name="fade">
          <div class="upload-actions" v-if="!$store.getters.uploadState">
            <button
              class="start-upload-action not-selected"
              :disabled="uplaodFilesLength == 0"
              @click="startUpload"
            >
              Partager
            </button>
          </div>
        </transition>
      </div>
      <section class="download-url" v-else>
        <span class="title-section-dowwnload-url">Lien vers le partage</span>
        <InputCopy :value="downloadURL" />
      </section>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import UploadFilesView from "./UploadFilesView.vue";
import OptionsCard from "./OptionsCard.vue";
import InputCopy from "@/components/common/InputCopy.vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

export default defineComponent({
  components: {
    UploadFilesView,
    OptionsCard,
    InputCopy,
  },
  setup() {
    return {};
  },
  data() {
    return {
      title: "Partage de fichiers",
      downloadURL: "",
      complete: false,
    };
  },
  computed: {
    uploadState(): "PENDING" | "SUCCESS" | "ERROR" | undefined {
      return this.$store.state.upload.uploadState;
    },
    uplaodFilesLength(): number {
      return this.$store.getters.uplaodFilesLength;
    },
  },
  watch: {
    uploadState(newVal, _) {
      if (newVal == "SUCCESS") {
        this.downloadURL = `${window.location.origin}/files?u=${this.$store.state.upload.uploadID}`;
      }
    },
  },
  methods: {
    startUpload() {
      this.$store.commit(UploadMutationTypes.SET_UPLOAD_STATE, "PENDING");
    },
  },
});
</script>

<style lang="scss" scoped>
.upload-card {
  display: flex;
  width: 100%;
  max-width: 40rem;
  height: 100%;
  max-height: 71rem;
  margin: auto;
  transition: height 0.5s ease;

  html[data-useragent*="Android"] &,
  html[data-useragent*="iPhone"] & {
    max-height: 100%;
  }
  .upload-card-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2.4rem;
    height: 100%;
    width: 100%;
  }
}
.upload-header {
  padding: 1rem 0 2rem 0;
  width: 100%;
  text-align: center;

  & .upload-card-title {
    font-size: 2.7rem;
    font-weight: 600;
  }
}
.upload-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0;
  height: 100%;
}
.upload-actions {
  display: flex;
  text-align: center;
  height: 30%;
  padding-top: 2.4rem;

  & .start-upload-action {
    width: 80%;
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

    &:not(:disabled) {
      opacity: 1;
      cursor: pointer;
      &:hover,
      &:focus {
        color: var(--color-primary);
        background-color: var(--color-main-background);
      }
      &:focus {
        box-shadow: 0 0 5px var(--color-primary);
      }
    }
  }
}

.download-url {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 40rem;
}

@media screen and (max-height: 800px) and (max-width: 600px) {
  .upload-card-wrapper {
    border-top: 0.1rem solid var(--color-border);
  }
}
</style>