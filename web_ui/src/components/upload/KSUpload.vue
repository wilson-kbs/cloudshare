<template>
  <div class="ks-upload">
    <div class="ks-upload-wrapper">
      <div class="ks-upload-content">
        <div class="ks-upload__header">
          <span class="header-title">Partage de fichiers</span>
        </div>
        <div class="ks-upload__body">
          <KSFileList />
          <OptionsCard />
        </div>
        <div class="ks-upload__actions">
          <KSButton :disable="filesListIsEmpty">Partager</KSButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import KSFileList from "./KSFileList.vue";
import OptionsCard from "./OptionsCard.vue";
import KSButton from "@/components/common/KSButton.vue";

import { UploadMutationTypes } from "@/store/modules/upload/mutation-types";

import type { ProcessState } from "@/_utils";

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
    return {};
  },
  computed: {
    state(): ProcessState {
      return this.$store.state.upload.processState;
    },
    filesListIsEmpty(): boolean {
      return this.$store.getters.UPLOAD__FilesLength == 0;
    },
    progress(): number {
      return this.$store.state.upload.progress;
    },
  },
  watch: {},
  methods: {
    startUpload() {
      this.$store.commit(UploadMutationTypes.PROCESS_STATE, "RUNNING");
    },
  },
});
</script>

<style lang="scss" scoped>
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