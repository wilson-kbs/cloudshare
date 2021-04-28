<template>
  <div class="filelist">
    <div class="filelist__header">
      <span class="header-title"> Fichier(s): </span>
      <span class="number-file">
        {{ $store.getters.UPLOAD__FilesLength }} / {{ maxFiles }} fichiers
      </span>
    </div>
    <div class="filelist__body">
      <DropZone />
    </div>
    <div class="filelist__footer">
      <span :class="['files-size', { error: sizeAllFiles > maxSizeFiles }]">
        {{ sizeAllFiles.formatToStringFileSize() }} / 10 Go
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DropZone from "./DropZone.vue";

export default defineComponent({
  components: {
    DropZone,
  },
  data() {
    return {
      maxSizeFiles: this.$store.state.upload.maxSizeFiles,
    };
  },
  computed: {
    maxFiles(): number {
      return this.$store.state.upload.maxFiles;
    },
    sizeAllFiles(): number {
      return this.$store.getters.UPLOAD__GetSizeOfAllFiles;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/font-awesome/fontawesome.scss";
@import "../../assets/styles/font-awesome/solid.scss";

.filelist {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  margin-bottom: 0.5rem;
}
.filelist__header {
  display: flex;
  flex-direction: row;
  padding-bottom: 2rem;

  .header-title {
    font-size: 1.6rem;
  }

  .number-file {
    align-self: center;
    margin-left: auto;
    font-size: 1.4rem;
    opacity: 0.6;
  }
}
.filelist__body {
  position: relative;

  border-radius: 2rem;
  height: 100%;
}

.filelist__footer {
  margin-top: 1rem;
  text-align: right;
  .files-size {
    font-size: 1.5rem;
    opacity: 0.6;

    &.error {
      color: var(--color-error);
    }
  }
}
</style>
