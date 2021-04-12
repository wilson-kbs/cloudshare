<template>
  <div class="ks-upload">
    <div :class="['ks-upload-wrapper', { 'upload-running': uploadIsStart }]">
      <transition name="scale">
        <div class="ks-upload-content" v-if="!uploadIsStart">
          <div class="ks-upload__header">
            <span class="header-title">Partage de fichiers</span>
          </div>
          <div class="ks-upload__body">
            <KSFileList />
            <OptionsCard />
          </div>
          <div class="ks-upload__actions">
            <KSButton
              class="send-upload"
              :disable="filesListIsEmpty"
              @click="animateBeforStart"
            >
              Partager
            </KSButton>
          </div>
        </div>
      </transition>
      <div
        v-if="showProgressBar"
        :class="[
          'progress-bar',
          { finish: successUpload },
          { error: errorUpload },
        ]"
        :style="{ width: `calc(50px + ${prevProgress}%)` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import anime from "animejs";

import KSFileList from "./KSFileList.vue";
import OptionsCard from "./OptionsCard.vue";
import KSButton from "@/components/common/KSButton.vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

import { ProcessState, sleep } from "@/_utils";
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
      uploadIsStart: false,
      showProgressBar: false,
      prevProgress: 0,
      successUpload: false,
      errorUpload: false,
      animeInstanceWrapper: null as anime.AnimeInstance | null,
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
    async progress(value: number) {
      if (this.processState.isRunning || this.processState.isFinish) {
        if (value > this.prevProgress) this.prevProgress += value;
        if (value == 100) {
          await sleep(1000);
          this.$nextTick(async () => {
            this.successUpload = true;
            await sleep(1000);
            this.$emit("complete");
          });
        }
      }
    },
    "processState.value"() {
      if (this.processState.isError) {
        this.errorUpload = true;
      }
    },
  },
  methods: {
    animateBeforStart() {
      console.log("Start Anime Upload");
      this.uploadIsStart = true;
      this.$nextTick(() => this.animeInstanceWrapper?.play());
    },
    startUpload(e?: any) {
      this.showProgressBar = true;
      this.$nextTick(() =>
        this.$store.dispatch(UploadActionTypes.START_UPLOAD)
      );
    },
  },
  mounted() {
    this.animeInstanceWrapper = anime({
      targets: ".ks-upload-wrapper",
      height: "50px",
      delay: 300,
      duration: 700,
      autoplay: false,
      easing: "linear",
      complete: () => {
        this.startUpload();
      },
    });
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
  transition: border-color 0.1s linear 0.5s;
  overflow: hidden;
  &.upload-running {
    border-color: var(--color-border);
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
  height: 20%;
  padding-top: 2.4rem;
  & > .send-upload {
    width: 70%;
    margin: auto;
  }
}

.progress-bar {
  position: absolute;
  top: 0;
  left: -50px;
  height: 100%;
  background-color: var(--color-primary);
  transition: width 1s linear, background-color 0.2s linear;
  border-radius: 5rem;

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