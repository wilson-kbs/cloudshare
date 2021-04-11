<template>
  <div class="ks-upload">
    <div :class="['ks-upload-wrapper', { 'upload-running': startUpload }]">
      <transition name="scale" v-on:after-leave="afterAnimate">
        <div class="ks-upload-content" v-if="!startUpload">
          <div class="ks-upload__header">
            <span class="header-title">Partage de fichiers</span>
          </div>
          <div class="ks-upload__body">
            <KSFileList />
            <OptionsCard />
          </div>
          <div class="ks-upload__actions">
            <KSButton :disable="filesListIsEmpty" @click="animateBeforStart"
              >Partager</KSButton
            >
          </div>
        </div>
      </transition>
      <div
        v-if="showProgressBar"
        class="progress-bar"
        :style="{ width: `${prevProgress}%` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import KSFileList from "./KSFileList.vue";
import OptionsCard from "./OptionsCard.vue";
import KSButton from "@/components/common/KSButton.vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

import { ProcessState, ProcessStateValue, sleep } from "@/_utils";
import { UploadActionTypes } from "@/store/modules/upload/action-types";

export default defineComponent({
  components: {
    KSFileList,
    OptionsCard,
    KSButton,
  },
  setup() {
    return {};
  },
  data() {
    return {
      startUpload: false,
      showProgressBar: false,
      prevProgress: 0,
    };
  },
  computed: {
    processState(): ProcessState {
      return this.$store.state.upload.processState;
    },
    filesListIsEmpty(): boolean {
      return this.$store.getters.UPLOAD__FilesLength == 0;
    },
    progress(): number {
      return (
        (this.$store.state.upload.bytesUploaded * 100) /
        this.$store.getters.UPLOAD__GetSizeOfAllFiles
      );
    },
  },
  watch: {
    progress(value: number) {
      if (value > this.prevProgress) this.prevProgress += value;
    },
    "processState.value"() {
      if (this.processState.isFinish) this.$emit("complete");
    },
  },
  methods: {
    animateBeforStart() {
      console.log("Start Anime Upload");
      this.startUpload = true;
    },
    async afterAnimate(e: any) {
      this.showProgressBar = true;
      //await sleep(500);
      this.$nextTick(() =>
        this.$store.dispatch(UploadActionTypes.START_UPLOAD)
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s linear;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.3);
  opacity: 0;
}
.ks-upload {
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
}
.ks-upload-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 3rem;
  margin: auto;
  transition: height 1s linear, border-color 0.1s linear;
  &.upload-running {
    height: 5rem;
    border-color: var(--color-border);
    overflow: hidden;
  }
}

.ks-upload-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.4rem;
  height: 100%;
  width: 100%;
}
.ks-upload__header {
  padding: 1rem 0 2rem 0;
  width: 100%;
  text-align: center;

  & .header-title {
    font-size: 2.7rem;
    font-weight: 600;
  }
}
.ks-upload__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0;
  height: 100%;
}
.ks-upload__actions {
  display: flex;
  text-align: center;
  height: 30%;
  padding-top: 2.4rem;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  max-width: 100%;
  background-color: var(--color-primary);
  transition: width 1s linear;

  &.finish {
    background-color: var(--color-success);
  }

  &.error {
    background-color: var(--color-error);
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
  .ks-upload-wrapper {
    border-top: 0.1rem solid var(--color-border);
  }
}
</style>